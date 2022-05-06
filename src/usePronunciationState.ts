import { useEffect, useState } from "react"
import * as uuid from 'uuid';

export const API_BASE_URL = 'api/pronunciations/pronunciation'

async function uploadFile(
  prefix: string,
  extension: string,
  file: Blob,
  contentType: string
) {
  const name = `${prefix}/${uuid.v4()}.${extension}`;
  const signedPostRes = await fetch(`${API_BASE_URL}/signed-post`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      file_name: name,
      content_type: contentType
    })
  })

  const signedPayload = (await signedPostRes.json()).payload;
  const form = new FormData();
  form.append('ACL', 'public-read');

  Object.entries(signedPayload.fields).forEach(([field, value]) => {
    form.append(field, value as string);
  })


  form.append('file', file, signedPayload.fields.key);
  await fetch(signedPayload.url, {
    method: 'POST',
    body: form,
  });

  return {
    filename: signedPayload.fields.key
  }
}

async function uploadPronunciation({
  name,
  soundsLike,
  audioPath,
  imagePath,
  secret,
}: any) {

  const res = await fetch(
    `${API_BASE_URL}/`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: name,
        sounds_like: soundsLike,
        audio_path: audioPath,
        image_path: imagePath,
        secret,
      })
    }
  )
  return await res.json();
};

export interface PronunciationSpec {
  uuid: string;
  name: string;
  sounds_like: string;
  audio_path?: string;
  image_path?: string;
}

interface AddPronunciationParams {
  name: string;
  soundsLike: string;
  secret: string;
  image?: File;
  audio?: Blob;
}

export interface UsePronunciationStateResponse {
  pronunciations: PronunciationSpec[],
  loadingPronunciations: boolean
  addPronunciation: (params: AddPronunciationParams) => Promise<void>;
  removePronunciation: (uuid: string, secret: string) => Promise<void>;
}

export function usePronunciationState(): UsePronunciationStateResponse {
  const [loadingPronunciations, setLoadingPronunciations] = useState<boolean>(false);
  const [pronunciations, setPronunciations] = useState<PronunciationSpec[]>([]);

  useEffect(() => { 
    loadPronunciations() 
  }, []) 

  async function loadPronunciations() {
    setLoadingPronunciations(true)
    const response = await fetch(API_BASE_URL);
    if (response.ok) {
      const initialItems = await response.json();
      setPronunciations(initialItems)
    }
    setLoadingPronunciations(false)
  }

  async function addPronunciation(params: AddPronunciationParams) {
    let imagePath;
    let audioPath;

    if (params.image) {
      const buffer = await params.image.arrayBuffer()
      const blob = new Blob([new Uint8Array(buffer)], { type: params.image.type })
      const { filename } = await uploadFile(
        'images',
        params.image.name.split('.').pop() as string,
        blob,
        params.image.type
      );
      imagePath = filename;
    }

    if (params.audio) {
      const { filename } = await uploadFile(
        'audio',
        'wav',
        params.audio,
        'audio/wav'
      );
      audioPath = filename;
    }

    const newPronunciation = await uploadPronunciation({
      name: params.name,
      soundsLike: params.soundsLike,
      imagePath,
      audioPath,
      secret: params.secret,
    });

    if (newPronunciation) {
      setPronunciations((existing) => {
        return [...existing, newPronunciation]
      })
    }
   
  }
  
  async function removePronunciation(uuid: string, secret: string) {
    const res = await fetch(`${API_BASE_URL}/${uuid}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        secret,
      })
    });

    if (res.ok) {
      setPronunciations((existing) => {
        return existing.filter((p) => p.uuid !== uuid)
      })
    } else {
      throw new Error('Unable to remove pronunciation')
    }
  }

  return {
    pronunciations,
    addPronunciation,
    loadingPronunciations,
    removePronunciation,
  }
}

