"use client"

import { ChangeEvent, FormEvent, useState } from 'react';
import styles from './styles.module.scss';
import { Button } from '@/app/dashboard/components/button';
import { UploadCloud } from 'lucide-react';
import Image from 'next/image'
import { api } from '@/services/api';
import { getCookieClient } from '@/lib/cookieClient';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { clear } from 'console';
import { AxiosError } from 'axios';

interface CategoryProps {
  id: string;
  name: string;
}

interface Props {
  categories: CategoryProps[];
}

export function Form({ categories }: Props) {
  const router = useRouter();
  const [image, setImage] = useState<File>();
  const [previewImage, setPreviewImage] = useState('');

  function handleError(err: unknown) {
    // Verifica se o erro é uma instância de AxiosError
    if (err instanceof AxiosError) {
        // Quando a resposta está presente
        if (err.response) {
            // Você pode customizar como deseja exibir o erro
            const errorMessage = err.response.data?.message || err.response.statusText;

            // Exibe uma notificação de erro para o usuário
            toast.warning(`Erro: ${errorMessage}`);
            console.error('Erro ao cadastrar produto:', errorMessage);
        } else {
            // Se não houver resposta (problema de rede ou algo no servidor)
            toast.warning("Falha ao conectar com o servidor. Tente novamente.");
            console.error('Erro de rede ou servidor:', err.message);
        }
    } else if (err instanceof Error) {
        // Caso o erro seja um erro genérico
        toast.warning(`Erro desconhecido: ${err.message}`);
        console.error('Erro desconhecido:', err);
    } else {
        // Caso o erro não seja do tipo esperado
        toast.warning("Erro desconhecido. Tente novamente mais tarde.");
        console.error('Erro desconhecido:', err);
    }
}

  async function handleRegisterProduct(formData: FormData) {
    const categoryIndex = formData.get("category");
    const name = formData.get('name') as string;
    const price = formData.get('price') as string;
    const description = formData.get('description') as string;

    if (!name || !categoryIndex || !price || !description || !image) {
        toast.warning('Preencha todos os campos!');
        return;
    }

    const data = new FormData();
    data.append("name", name);
    data.append("price", price);
    data.append("description", description);
    data.append("category_id", categories[Number(categoryIndex)].id);
    data.append("file", image);

    const token = getCookieClient();
    console.log('Token:', token);

    try {
        // Espera a requisição ser concluída antes de exibir o toast de sucesso
        await api.post("/product", data, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        toast.success("Produto cadastrado com sucesso!");
        router.push("/dashboard");
    } catch (err) {
      handleError(err)
      /*const axiosError = err as AxiosError

      console.error('Erro ao cadastrar o produto', axiosError)

      if( axiosError.response){
        console.error('Erro de resposta', axiosError.response.status)
        console.error('mensagem: ', axiosError.response.data)
        
      }
        console.log(err);
        toast.warning("Falha ao cadastrar o produto");*/
    }
}


function handleFile(e: ChangeEvent<HTMLInputElement>) {
  if (e.target.files && e.target.files[0]) {
      const image = e.target.files[0];
      if (image.size > 50 * 1024 * 1024) { // 5MB
          toast.warning('A imagem é muito grande. Máximo permitido: 5MB.');
          return;
      }
      if (image.type !== 'image/jpeg' && image.type !== 'image/png') {
          toast.warning('Formato não permitido!');
          return;
      }
      setImage(image);
      setPreviewImage(URL.createObjectURL(image));
  }
}


  return (
    <main className={styles.container}>
      <h1>Novo produto</h1>
      <form className={styles.form} action={handleRegisterProduct}>
        
       <label className={styles.labelImage}>

        <span>
          <UploadCloud size={30} color="#000"/>
        </span>

        <input
          type="file"
          accept="image/jpeg, image/png"
          required
          onChange={handleFile}
        />

        {previewImage && (
          <Image
            alt="Imagem de preview"
            src={previewImage}
            className={styles.preview}
            fill={true}
            quality={100}
            priority={true}
          />
        )}

       </label>

        <select name="category" required>
          {categories.map((category, index) => (
            <option key={category.id} value={index}>
              {category.name}
            </option>
          ))}
        </select>
        <input
          type="text"
          name="name"
          placeholder="Digite o nome do produto..."
          required
          className={styles.input}
        />
        <input
          type="text"
          name="price"
          placeholder="Preço do produto..."
          required
          className={styles.input}
        />
        <textarea
          className={styles.input}
          placeholder="Digite a descrição do produto..."
          required
          name="description"
        ></textarea>

        <Button name="Cadastrar produto" />
      </form>
    </main>
  );
}
