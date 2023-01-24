declare global {
  interface Window {
    grecaptcha: any;
  }
}

export interface SpotifyData {
  error?: string;
  error_description?: string;
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
}

export interface SpotifyTopArtistData {
  items: SpotifyArtist[];
}

export interface SpotifyArtist {
  external_urls: {
    spotify: string;
  };
  followers: {
    href: string;
    total: number;
  };
  genres: string[];
  href: string;
  id: string;
  images: {
    url: string;
    height: number;
    width: number;
  }[];
  name: string;
  popularity: number;
  type: string;
  uri: string;
}

export interface PaisFields {
  ID: string;
  Nombre: string;
  Nombre_Corto: string;
}

export interface SignUpInput {
  Email: string;
  Apellido: string;
  Nombre: string;
  Contraseña: string;
  Nacimiento: Date;
  Pais: number;
  token: string;
}

export interface Usuario {
  ID: string;
  Nombre: string;
  Apellido: string;
  Usuario: string;
  Contraseña?: string;
  Nacimiento: Date;
  Pais: string;
}

type ResponseData = {
  message: string;
  data?: any;
};
