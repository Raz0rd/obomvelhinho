import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'pedidos.db');
const db = new Database(dbPath);

// Criar tabela de pedidos se não existir
db.exec(`
  CREATE TABLE IF NOT EXISTS pedidos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    transaction_id TEXT UNIQUE NOT NULL,
    
    -- Dados do Cliente
    nome TEXT NOT NULL,
    email TEXT NOT NULL,
    telefone TEXT NOT NULL,
    cpf TEXT NOT NULL,
    
    -- Endereço
    cep TEXT NOT NULL,
    endereco TEXT NOT NULL,
    numero TEXT NOT NULL,
    complemento TEXT,
    bairro TEXT NOT NULL,
    cidade TEXT NOT NULL,
    estado TEXT NOT NULL,
    
    -- Dados do Pedido
    items TEXT NOT NULL,
    total REAL NOT NULL,
    status TEXT DEFAULT 'AGUARDANDO_PAGAMENTO',
    
    -- Controle de Envio
    enviado INTEGER DEFAULT 0,
    codigo_rastreio TEXT,
    data_envio TEXT,
    
    -- Datas
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
  )
`);

// Índices para melhor performance
db.exec(`
  CREATE INDEX IF NOT EXISTS idx_transaction_id ON pedidos(transaction_id);
  CREATE INDEX IF NOT EXISTS idx_email ON pedidos(email);
  CREATE INDEX IF NOT EXISTS idx_status ON pedidos(status);
  CREATE INDEX IF NOT EXISTS idx_enviado ON pedidos(enviado);
  CREATE INDEX IF NOT EXISTS idx_created_at ON pedidos(created_at);
`);

export default db;
