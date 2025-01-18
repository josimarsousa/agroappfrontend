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
        console.log(err);
        toast.warning("Falha ao cadastrar o produto");
    }
}


function handleFile(e: ChangeEvent<HTMLInputElement>) {
  if (e.target.files && e.target.files[0]) {
      const image = e.target.files[0];
      if (image.size > 5 * 1024 * 1024) { // 5MB
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

        <select name="category">
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
