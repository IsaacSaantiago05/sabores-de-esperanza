# Ejemplos de Componentes - Sabores de Esperanza

## 1. Botón Personalizado

```tsx
// components/ui/Button.tsx
import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  onClick,
  className = '',
}) => {
  const baseClass = 'font-medium rounded-lg transition-all duration-200';
  
  const variantClass = {
    primary: 'bg-sabores-verde-medio text-white hover:bg-sabores-verde-oscuro',
    secondary: 'bg-sabores-beige text-sabores-verde-oscuro hover:bg-sabores-beige-claro',
    danger: 'bg-red-600 text-white hover:bg-red-700',
  }[variant];

  const sizeClass = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  }[size];

  return (
    <button
      className={`${baseClass} ${variantClass} ${sizeClass} ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      } ${className}`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
```

---

## 2. Tarjeta de Empresa

```tsx
// components/ui/EmpresaCard.tsx
import React from 'react';
import { MapPin, Phone, Mail } from 'feather-icons-react';

interface EmpresaCardProps {
  nombre: string;
  tipo: 'Donadora' | 'Beneficiada';
  telefono: string;
  email: string;
  direccion: string;
  logoUrl?: string;
  onVerMas?: () => void;
}

export const EmpresaCard: React.FC<EmpresaCardProps> = ({
  nombre,
  tipo,
  telefono,
  email,
  direccion,
  logoUrl,
  onVerMas,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border-l-4 border-sabores-verde-medio">
      {logoUrl && (
        <img
          src={logoUrl}
          alt={nombre}
          className="w-16 h-16 rounded-full mb-4 object-cover"
        />
      )}
      
      <h3 className="text-xl font-bold text-sabores-verde-oscuro mb-2">
        {nombre}
      </h3>
      
      <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-4 ${
        tipo === 'Donadora'
          ? 'bg-sabores-verde-claro text-sabores-verde-oscuro'
          : 'bg-sabores-beige text-sabores-marron'
      }`}>
        {tipo}
      </span>

      <div className="space-y-2 text-sm text-gray-600 mb-4">
        <div className="flex items-start gap-2">
          <MapPin size={16} className="mt-1 flex-shrink-0 text-sabores-verde-medio" />
          <span>{direccion}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <Phone size={16} className="text-sabores-verde-medio" />
          <span>{telefono}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <Mail size={16} className="text-sabores-verde-medio" />
          <span className="truncate">{email}</span>
        </div>
      </div>

      <button
        onClick={onVerMas}
        className="w-full bg-sabores-verde-medio text-white py-2 rounded-md hover:bg-sabores-verde-oscuro transition"
      >
        Ver Detalles
      </button>
    </div>
  );
};
```

---

## 3. Formulario de Empresa

```tsx
// components/forms/RegistroEmpresaForm.tsx
'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  nombre: z.string().min(3, 'Nombre debe tener al menos 3 caracteres'),
  email: z.string().email('Email inválido'),
  telefonoContacto: z.string().regex(/^\+?[0-9]{7,}/, 'Teléfono inválido'),
  direccion: z.string().min(5, 'Dirección requerida'),
  ciudad: z.string().min(2, 'Ciudad requerida'),
  rubro: z.string().min(3, 'Rubro requerido'),
  tipoEmpresa: z.enum(['Donadora', 'Beneficiada']),
  personaContacto: z.string().min(3, 'Nombre de contacto requerido'),
});

type FormData = z.infer<typeof schema>;

export const RegistroEmpresaForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    console.log('Form data:', data);
    // Enviar al API
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Nombre */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nombre de la Empresa
          </label>
          <input
            {...register('nombre')}
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sabores-verde-medio focus:border-transparent"
            placeholder="Ej: Supermercado ABC"
          />
          {errors.nombre && (
            <p className="text-red-500 text-sm mt-1">{errors.nombre.message}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            {...register('email')}
            type="email"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sabores-verde-medio focus:border-transparent"
            placeholder="empresa@ejemplo.com"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Teléfono */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Teléfono de Contacto
          </label>
          <input
            {...register('telefonoContacto')}
            type="tel"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sabores-verde-medio focus:border-transparent"
            placeholder="+57 3001234567"
          />
          {errors.telefonoContacto && (
            <p className="text-red-500 text-sm mt-1">
              {errors.telefonoContacto.message}
            </p>
          )}
        </div>

        {/* Tipo de Empresa */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo de Empresa
          </label>
          <select
            {...register('tipoEmpresa')}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sabores-verde-medio focus:border-transparent"
          >
            <option value="">Seleccionar</option>
            <option value="Donadora">Empresa Donadora</option>
            <option value="Beneficiada">Empresa Beneficiada</option>
          </select>
          {errors.tipoEmpresa && (
            <p className="text-red-500 text-sm mt-1">
              {errors.tipoEmpresa.message}
            </p>
          )}
        </div>

        {/* Direccion */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Dirección
          </label>
          <input
            {...register('direccion')}
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sabores-verde-medio focus:border-transparent"
            placeholder="Calle 123 #45-67"
          />
          {errors.direccion && (
            <p className="text-red-500 text-sm mt-1">{errors.direccion.message}</p>
          )}
        </div>

        {/* Ciudad */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ciudad
          </label>
          <input
            {...register('ciudad')}
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sabores-verde-medio focus:border-transparent"
            placeholder="Bogotá"
          />
          {errors.ciudad && (
            <p className="text-red-500 text-sm mt-1">{errors.ciudad.message}</p>
          )}
        </div>

        {/* Rubro */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rubro/Industria
          </label>
          <input
            {...register('rubro')}
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sabores-verde-medio focus:border-transparent"
            placeholder="Supermercado, Restaurante, ONG, etc."
          />
          {errors.rubro && (
            <p className="text-red-500 text-sm mt-1">{errors.rubro.message}</p>
          )}
        </div>

        {/* Persona de Contacto */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Persona de Contacto
          </label>
          <input
            {...register('personaContacto')}
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sabores-verde-medio focus:border-transparent"
            placeholder="Juan Pérez"
          />
          {errors.personaContacto && (
            <p className="text-red-500 text-sm mt-1">
              {errors.personaContacto.message}
            </p>
          )}
        </div>
      </div>

      <button
        type="submit"
        className="mt-6 w-full bg-sabores-verde-medio text-white py-3 rounded-lg hover:bg-sabores-verde-oscuro transition font-medium"
      >
        Registrar Empresa
      </button>
    </form>
  );
};
```

---

## 4. Componente de Mapa

```tsx
// components/maps/MapaIntegrativo.tsx
'use client';

import React from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';

interface Ubicacion {
  id: string;
  nombre: string;
  latitud: number;
  longitud: number;
  tipo: 'Donadora' | 'Beneficiada';
  telefono: string;
}

interface MapaIntegrativoProps {
  ubicaciones: Ubicacion[];
  zoom?: number;
}

export const MapaIntegrativo: React.FC<MapaIntegrativoProps> = ({
  ubicaciones,
  zoom = 12,
}) => {
  const [selectedMarker, setSelectedMarker] = React.useState<Ubicacion | null>(null);

  const centroMapa = ubicaciones.length > 0
    ? { lat: ubicaciones[0].latitud, lng: ubicaciones[0].longitud }
    : { lat: 4.7110, lng: -74.0721 }; // Bogotá por defecto

  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
      <GoogleMap
        mapContainerStyle={{ width: '100%', height: '500px' }}
        center={centroMapa}
        zoom={zoom}
      >
        {ubicaciones.map((ubicacion) => (
          <Marker
            key={ubicacion.id}
            position={{
              lat: ubicacion.latitud,
              lng: ubicacion.longitud,
            }}
            onClick={() => setSelectedMarker(ubicacion)}
            icon={{
              url: ubicacion.tipo === 'Donadora'
                ? 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgdmlld0JveD0iMCAwIDI0IDI0Ij48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMCIgZmlsbD0iIzZCOUYzRiIvPjwvc3ZnPg=='
                : 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgdmlld0JveD0iMCAwIDI0IDI0Ij48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMCIgZmlsbD0iI0Q0QTU3NCIvPjwvc3ZnPg==',
              scaledSize: new window.google.maps.Size(32, 32),
            }}
          />
        ))}

        {selectedMarker && (
          <InfoWindow
            position={{
              lat: selectedMarker.latitud,
              lng: selectedMarker.longitud,
            }}
            onCloseClick={() => setSelectedMarker(null)}
          >
            <div className="p-3 w-64">
              <h3 className="font-bold text-lg mb-2">{selectedMarker.nombre}</h3>
              <p className="text-sm text-gray-600 mb-2">
                <strong>Tipo:</strong> {selectedMarker.tipo}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Teléfono:</strong> {selectedMarker.telefono}
              </p>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </LoadScript>
  );
};
```

---

## 5. Dashboard Estadísticas

```tsx
// components/dashboard/ResumenEstadisticas.tsx
import React from 'react';
import { TrendingUp, Users, Gift, MapPin } from 'feather-icons-react';

interface Estadisticas {
  totalEmpresas: number;
  totalDonaciones: number;
  kgDonados: number;
  personasAtendidas: number;
}

export const ResumenEstadisticas: React.FC<{ stats: Estadisticas }> = ({ stats }) => {
  const tarjetas = [
    {
      titulo: 'Empresas Registradas',
      valor: stats.totalEmpresas,
      icono: Users,
      color: 'bg-sabores-verde-claro',
    },
    {
      titulo: 'Donaciones Realizadas',
      valor: stats.totalDonaciones,
      icono: Gift,
      color: 'bg-sabores-beige',
    },
    {
      titulo: 'Kg Donados',
      valor: stats.kgDonados.toFixed(0),
      icono: TrendingUp,
      color: 'bg-sabores-verde-medio',
    },
    {
      titulo: 'Personas Atendidas',
      valor: stats.personasAtendidas,
      icono: MapPin,
      color: 'bg-sabores-marron',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {tarjetas.map((tarjeta, index) => {
        const Icono = tarjeta.icono;
        return (
          <div
            key={index}
            className={`${tarjeta.color} rounded-lg p-6 text-white shadow-md`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-75">{tarjeta.titulo}</p>
                <p className="text-3xl font-bold mt-2">{tarjeta.valor}</p>
              </div>
              <Icono size={32} className="opacity-50" />
            </div>
          </div>
        );
      })}
    </div>
  );
};
```

---

## 6. Configuración de Tailwind

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'sabores-verde-oscuro': '#2D5016',
        'sabores-verde-medio': '#6B9F3F',
        'sabores-verde-claro': '#A8D08D',
        'sabores-beige': '#F5E6D3',
        'sabores-beige-claro': '#FAF7F2',
        'sabores-marron': '#D4A574',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Poppins', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}

export default config
```

---

¡Usa estos componentes como punto de partida para tu aplicación! Personalízalos según tus necesidades.
