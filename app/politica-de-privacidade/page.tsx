import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Termos e Políticas - Obom Velhinho',
  description: 'Política de privacidade, trocas, devoluções e informações da Obom Velhinho',
};

export default function PoliticaDePrivacidade() {
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
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Termos e Políticas</h1>

      {/* Conteúdo */}
      <div className="prose prose-lg max-w-none">
        <div className="bg-white rounded-lg shadow-md p-8 space-y-6">
          {/* Informações da Empresa */}
          <section className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Informações da Empresa</h2>
            <div className="space-y-2 text-gray-700">
              <p><strong>Razão Social:</strong> Loja do Noel</p>
              <p><strong>CNPJ:</strong> 57.161.373/0001-61</p>
              <p>
                <strong>E-mail:</strong>{' '}
                <a href="mailto:sac@obomvelhinho.store" className="text-red-600 hover:text-red-700">
                  sac@obomvelhinho.store
                </a>
              </p>
              <p><strong>Telefone:</strong> (45) 91119-366</p>
              <p><strong>Endereço:</strong> Av. Corbélia, 470 - Sala 01</p>
              <p><strong>Bairro:</strong> Morumbi - Cascavel/PR</p>
              <p><strong>CEP:</strong> 85817-775</p>
            </div>
          </section>

          {/* Política de Privacidade */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Política de Privacidade</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Bem-vindo à <strong>Obom Velhinho</strong>! Sua privacidade é importante para nós. Esta Política de 
              Privacidade explica como coletamos, usamos, protegemos e compartilhamos suas informações quando você 
              acessa nosso site <strong>arvoresdenatal2025.shop</strong> e utiliza nossos serviços.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">Informações que Coletamos</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li><strong>Informações Pessoais:</strong> Nome, e-mail, telefone, endereço de entrega e informações de pagamento.</li>
              <li><strong>Informações de Navegação:</strong> Endereço IP, tipo de navegador, páginas acessadas e tempo de permanência.</li>
              <li><strong>Cookies e Tecnologias Semelhantes:</strong> Usamos cookies para melhorar sua experiência no site.</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-3">
              Você pode desativar os cookies nas configurações do seu navegador.
            </p>
          </section>

          {/* Política de Trocas e Devoluções */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Política de Trocas e Devoluções</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              De acordo com o Código de Defesa do Consumidor (Lei nº 8.078/90), você tem o direito de:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Arrependimento da compra em até 7 dias, sem necessidade de justificativa;</li>
              <li>Troca de produtos com defeitos de fabricação;</li>
              <li>Devolução em caso de produtos diferentes do anunciado.</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              Para solicitar troca ou devolução, entre em contato pelo e-mail:{' '}
              <a href="mailto:sac@obomvelhinho.store" className="text-red-600 hover:text-red-700 font-medium">
                sac@obomvelhinho.store
              </a>
            </p>
          </section>

          {/* Garantia dos Produtos */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Garantia dos Produtos</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              Todos os produtos comercializados possuem garantia contra defeitos de fabricação:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Garantia legal de 90 dias para produtos não duráveis;</li>
              <li>Garantia legal de 90 dias para produtos duráveis;</li>
              <li>Garantia contratual adicional quando especificada no produto.</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-3">
              A garantia não cobre danos causados por uso inadequado ou acidentes.
            </p>
          </section>

          {/* Política de Entrega */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Política de Entrega</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              Informações sobre prazos e condições de entrega:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Prazo de entrega informado no momento da compra;</li>
              <li>Rastreamento disponível após confirmação do pagamento;</li>
              <li>Entrega em todo território nacional.</li>
            </ul>
          </section>

          {/* Política de Pagamento */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Política de Pagamento</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              Forma de pagamento aceita:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li><strong>PIX</strong> - Pagamento instantâneo e aprovação imediata</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-3 text-sm italic">
              * Outras formas de pagamento estarão disponíveis em breve.
            </p>
          </section>

          {/* Contato e Suporte */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Contato e Suporte</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              Para qualquer dúvida, reclamação ou sugestão, entre em contato:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700">
                <strong>E-mail:</strong>{' '}
                <a href="mailto:sac@obomvelhinho.store" className="text-red-600 hover:text-red-700 font-medium">
                  sac@obomvelhinho.store
                </a>
              </p>
              <p className="text-gray-700 mt-2">
                <strong>Telefone:</strong> (45) 91119-366
              </p>
              <p className="text-gray-700 mt-2">
                <strong>Horário de Atendimento:</strong> Segunda a Sexta, das 09h às 18h
              </p>
            </div>
          </section>

          {/* Alterações na Política */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Alterações na Política de Privacidade</h2>
            <p className="text-gray-700 leading-relaxed">
              Podemos atualizar esta Política periodicamente. Recomendamos que você a revise regularmente. 
              Alterações significativas serão notificadas em nosso site ou por e-mail.
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
