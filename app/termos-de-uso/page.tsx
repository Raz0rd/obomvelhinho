import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Termos de Uso - Obom Velhinho',
  description: 'Termos e condições de uso da Obom Velhinho',
};

export default function TermosDeUso() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      {/* Botão Voltar */}
      <Link 
        href="/"
        className="inline-flex items-center gap-2 text-red-600 hover:text-red-700 mb-8 font-medium"
      >
        <ArrowLeft size={20} />
        Voltar
      </Link>

      {/* Título */}
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Termos de Uso</h1>

      {/* Conteúdo */}
      <div className="prose prose-lg max-w-none">
        <div className="bg-white rounded-lg shadow-md p-8 space-y-6">
          {/* Introdução */}
          <p className="text-gray-700 leading-relaxed">
            Bem-vindo à <strong>Obom Velhinho</strong>! Ao acessar e utilizar nosso site{' '}
            <strong>arvoresdenatal2025.shop</strong>, você concorda com os termos e condições 
            estabelecidos neste documento. Estes Termos de Uso regulam seu acesso e uso dos 
            serviços oferecidos em nossa plataforma.
          </p>

          {/* Seção 1 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Aceitação dos Termos</h2>
            <p className="text-gray-700 leading-relaxed">
              Ao utilizar nosso site, você confirma que leu, entendeu e concorda com estes termos. 
              Se você não concordar com qualquer parte destes termos, pedimos que não utilize nossos serviços.
            </p>
          </section>

          {/* Seção 2 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Produtos e Serviços</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              Nos esforçamos para fornecer descrições precisas dos produtos. No entanto:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>As cores podem variar dependendo da configuração do seu monitor;</li>
              <li>Produtos podem sofrer alterações sem aviso prévio;</li>
              <li>Nos reservamos o direito de limitar quantidades de itens por pedido.</li>
            </ul>
          </section>

          {/* Seção 3 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Preços e Pagamentos</h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Os preços estão sujeitos a alterações sem aviso prévio;</li>
              <li>Aceitamos as formas de pagamento disponíveis em nosso checkout;</li>
              <li>Todos os pagamentos são processados de forma segura;</li>
              <li>Podemos oferecer descontos e promoções por tempo limitado.</li>
            </ul>
          </section>

          {/* Seção 4 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Entregas e Devoluções</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              Nossa política de entregas e devoluções está de acordo com o Código de Defesa do Consumidor:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Os prazos de entrega são estimados e podem variar conforme a região;</li>
              <li>É possível realizar devoluções em até 7 dias após o recebimento do produto;</li>
              <li>Produtos personalizados ou com embalagem violada podem não ser elegíveis para devolução.</li>
            </ul>
          </section>

          {/* Seção 5 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Propriedade Intelectual</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              Todo o conteúdo do site, incluindo textos, imagens, logos, design e código, são de 
              propriedade exclusiva da Obom Velhinho ou de seus licenciadores. É proibido:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Copiar, modificar ou distribuir o conteúdo sem autorização;</li>
              <li>Utilizar nossas marcas ou material visual sem permissão expressa;</li>
              <li>Realizar engenharia reversa ou tentar extrair o código-fonte do site.</li>
            </ul>
          </section>

          {/* Seção 6 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Limitação de Responsabilidade</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              Obom Velhinho não se responsabiliza por:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Danos indiretos resultantes do uso ou impossibilidade de uso do site;</li>
              <li>Interrupções temporárias do serviço por manutenção ou problemas técnicos;</li>
              <li>Conteúdo de sites de terceiros para os quais possamos direcionar através de links.</li>
            </ul>
          </section>

          {/* Seção 7 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Alterações nos Termos</h2>
            <p className="text-gray-700 leading-relaxed">
              Reservamo-nos o direito de modificar estes termos a qualquer momento. As alterações 
              entrarão em vigor imediatamente após a publicação no site. É responsabilidade do usuário 
              verificar periodicamente os termos atualizados.
            </p>
          </section>

          {/* Seção 8 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Lei Aplicável</h2>
            <p className="text-gray-700 leading-relaxed">
              Estes termos são regidos pelas leis brasileiras. Qualquer disputa relacionada a estes 
              termos será resolvida nos tribunais do Brasil.
            </p>
          </section>

          {/* Seção 9 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Contato</h2>
            <p className="text-gray-700 leading-relaxed">
              Se tiver dúvidas sobre estes Termos de Uso, entre em contato pelo e-mail:{' '}
              <a 
                href="mailto:sac@obomvelhinho.store" 
                className="text-red-600 hover:text-red-700 font-medium"
              >
                sac@obomvelhinho.store
              </a>
            </p>
          </section>

          {/* Data */}
          <div className="pt-6 border-t border-gray-200 mt-8">
            <p className="text-sm text-gray-500">
              Última atualização: Janeiro de 2025
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
