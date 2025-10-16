'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Clock, Mail, CreditCard } from 'lucide-react';

export default function Footer() {
  return (
    <div className="w-full">
      <footer className="w-full px-6 py-8" style={{ backgroundColor: '#6E1032' }}>
        <div className="max-w-7xl mx-auto">
          {/* Logo */}
          <div className="relative mb-6" style={{ height: '80px', width: 'auto' }}>
            <Image
              src="/logoOBomvelhinho.webp"
              alt="Obom Velhinho"
              width={120}
              height={80}
              className="object-contain"
            />
          </div>

          {/* Grid de Informações */}
          <div className="grid gap-8 grid-cols-1 md:grid-cols-3">
            {/* Horário de Atendimento */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-white" />
                <h3 className="font-semibold text-base text-white">
                  Horário de Atendimento
                </h3>
              </div>
              <p className="text-sm text-white">Segunda à Sexta, 9h - 18h</p>
            </div>

            {/* Suporte */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-white" />
                <h3 className="font-semibold text-base text-white">Suporte</h3>
              </div>
              <a href="mailto:sac@obomvelhinho.store" className="text-sm text-white hover:underline">
                sac@obomvelhinho.store
              </a>
            </div>

            {/* Formas de Pagamento */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-white" />
                <h3 className="font-semibold text-base text-white">
                  Formas de Pagamento
                </h3>
              </div>
              <div className="flex flex-wrap gap-2 pt-2">
                <Image src="/pix.svg" alt="PIX" width={50} height={25} className="w-[50px] h-[25px]" />
                {/* Formas de pagamento temporariamente desabilitadas */}
                {/* <Image src="/visa.svg" alt="Visa" width={50} height={25} className="w-[50px] h-[25px]" /> */}
                {/* <Image src="/mastercard.svg" alt="Mastercard" width={50} height={25} className="w-[50px] h-[25px]" /> */}
                {/* <Image src="/boleto.svg" alt="Boleto" width={50} height={25} className="w-[50px] h-[25px]" /> */}
                {/* <Image src="/hipercard.svg" alt="Hipercard" width={50} height={25} className="w-[50px] h-[25px]" /> */}
                {/* <Image src="/amex.svg" alt="American Express" width={50} height={25} className="w-[50px] h-[25px]" /> */}
              </div>
            </div>
          </div>

          {/* Selos de Segurança */}
          <div className="mt-8">
            <div className="flex flex-wrap gap-4 items-center">
              <Image 
                src="/reclame-aqui.webp" 
                alt="Reclame Aqui RA1000" 
                width={120} 
                height={60} 
                className="h-[60px] w-auto object-contain"
              />
              <Image 
                src="/ssl-secure.webp" 
                alt="Site Seguro Certificado SSL" 
                width={100} 
                height={50} 
                className="h-[50px] w-auto object-contain"
              />
              <Image 
                src="/google-site-seguro.webp" 
                alt="Google Site Seguro" 
                width={120} 
                height={50} 
                className="h-[50px] w-auto object-contain"
              />
            </div>
          </div>
        </div>
      </footer>

      {/* Copyright */}
      <div
        className="text-center flex-col flex items-center justify-center py-4 text-sm"
        style={{ color: '#636363', backgroundColor: '#DEDEDE' }}
      >
        <p className="font-medium">© 2025 Obom Velhinho | Todos os direitos reservados.</p>
        <p>
          <span>CNPJ: 57.161.373/0001-61 | </span>
          <span>Telefone: (45) 91119-366 | </span>
          <span>E-mail: sac@obomvelhinho.store</span>
        </p>
        <p className="text-xs mt-1">
          Av. Corbélia, 470 - Sala 01 - Morumbi, Cascavel - PR, 85817-775
        </p>
        <div className="flex items-center gap-2 mt-2">
          <Link href="/politica-de-privacidade" className="hover:underline">
            Política de Privacidade
          </Link>
          <span>|</span>
          <Link href="/termos-de-uso" className="hover:underline">
            Termos de uso
          </Link>
        </div>
      </div>
    </div>
  );
}
