import PageTitle from 'src/components/PageTitle';
import { Box, Flex } from '@radix-ui/themes';
import { useState } from 'react';
import Dropzone from 'src/components/Dropzone';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { addDocument, findAll } from 'src/api/endpoints/documents';

const Drive = () => {
  const [document, setDocument] = useState<File | null>(null);

  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ['documents'],
    queryFn: () => findAll(),
  });

  const addDocumentMutation = useMutation({
    mutationFn: addDocument,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      setDocument(null);
    },
  });

  const onDrop = (files: File[]) => {
    const formData = new FormData();
    formData.append('image', files[0]);

    addDocumentMutation.mutate(formData);
  };

  return (
    <>
      <PageTitle title="Drive" />
      <Flex justify="center" mb="9">
        <Dropzone
          onChange={(file: File | null) => setDocument(file)}
          value={document}
          size="crop"
          onDrop={onDrop}
        />
      </Flex>
      <Flex align="center" direction="column" gap="2">
        <PageTitle type="h2" title="Mes documents déposés" />
        <Flex gap="4">
          {data?.map((document, index) => (
            <Box className="w-36" key={index}>
              <img
                src={document.document_path}
                alt={document.document_name}
                style={{
                  objectFit: 'cover',
                  width: '100%',
                  height: '100%',
                  borderRadius: 'var(--radius-2)',
                }}
              />
            </Box>
          ))}
        </Flex>
      </Flex>
    </>
  );
};

export default Drive;
