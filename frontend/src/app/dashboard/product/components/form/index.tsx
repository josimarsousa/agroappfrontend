"use client"

import { ChangeEvent, FormEvent, useState } from 'react';
import styles from './styles.module.scss';
import { Button } from '@/app/dashboard/components/button';
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
  const [selectedCategory, setSelectedCategory] = useState(''); // Estado para a categoria selecionada

  async function handleRegisterProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const name = formData.get('name') as string;
    const price = formData.get('price') as string;
    const description = formData.get('description') as string;
    const categoryIndex = formData.get('category') as string;

    if (!name || !categoryIndex || !price || !description || !image) {
      toast.warning('Preencha todos os campos!');
      return;
    }

    // Adicionando a imagem ao FormData
    const data = new FormData();
    data.append('name', name);
    data.append('price', price);
    data.append('description', description);
    data.append('category_id', categories[Number(categoryIndex)].id);
    data.append('file', image);

    // Obtendo o token de autenticação
    const token = getCookieClient();
    console.log('Token:', token); // Adicionando um log para verificar o token

    try {
      const response = await api.post('/product', data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('Resposta da API:', response);

      toast.success('Produto registrado com sucesso!');
      router.push('/dashboard');
    } catch (err) {
      console.error(err);
      toast.warning('Falha ao cadastrar esse produto!');
    }
  }

  function handleFile(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      const selectedImage = e.target.files[0];
      if (selectedImage.type !== 'image/jpeg' && selectedImage.type !== 'image/png') {
        toast.warning('Formato não permitido!');
        return;
      }
      setImage(selectedImage);
      setPreviewImage(URL.createObjectURL(selectedImage));
    }
  }

  // Função para lidar com a mudança de categoria
  const handleCategoryChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(event.target.value);
  };

  return (
    <main className={styles.container}>
      <h1>Novo produto</h1>
      <form className={styles.form} onSubmit={handleRegisterProduct}>
        <select
          name="category"
          value={selectedCategory} // Controla o valor selecionado
          onChange={handleCategoryChange} // Atualiza o estado quando a categoria mudar
        >
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

        {/* Adicionando campo para upload de imagem */}
        <input
          type="file"
          accept="image/jpeg, image/png"
          required
          onChange={handleFile}
        />
        {previewImage && (
          <img src={previewImage} alt="Pré-visualização da imagem" className={styles.previewImage} />
        )}

        <Button name="Cadastrar produto" />
      </form>
    </main>
  );
}
