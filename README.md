## Agendamento de Consultas + Painel Administrativo
Este é um projeto de agendamento de consultas online, construído com HTML, CSS e JavaScript, que oferece aos usuários a capacidade de marcar consultas de forma simples e intuitiva. Para os administradores, há um painel administrativo dedicado, onde é possível gerenciar e acompanhar todas as consultas. A autenticação de usuários é gerenciada pelo Firebase, e os usuários recebem uma confirmação de agendamento via WhatsApp.

## 🚀 Funcionalidades
Para Usuários
Agendamento de Consultas: Interface simples para selecionar data, hora e tipo de serviço.

Confirmação por WhatsApp: Após o agendamento, o usuário recebe uma mensagem automática no WhatsApp com os detalhes da consulta.

Autenticação Segura: Login e cadastro de usuários gerenciados pelo Firebase Authentication.

Para Administradores
Painel Administrativo: Visualização e gerenciamento de todas as consultas agendadas.

Gestão de Consultas: Possibilidade de aprovar, cancelar ou reagendar consultas.

Visualização de Dados: Acesso a informações sobre o volume de agendamentos e outros dados relevantes.

## 🛠️ Tecnologias Utilizadas
HTML5: Estrutura da página.

CSS3: Estilização e layout.

JavaScript (ES6+): Lógica de interação e funcionalidades do cliente.

Firebase:

Firebase Authentication: Para o sistema de login e cadastro.

Firestore Database: Para armazenar os dados de consultas e usuários.

API do WhatsApp: Para o envio de mensagens de confirmação (descreva qual serviço de API você usou, se for o caso).

## ⚙️ Como Executar o Projeto
Para executar este projeto localmente, siga os passos abaixo:

Clone o repositório:

Bash

git clone https://github.com/seu-usuario/seu-repositorio.git
Navegue até o diretório do projeto:

Bash

cd seu-repositorio
Configurações do Firebase:

Crie um novo projeto no console do Firebase.

Habilite o Firebase Authentication e o Firestore Database.

Obtenha suas credenciais de configuração (apiKey, authDomain, projectId, etc.).

Crie um arquivo chamado firebase-config.js na raiz do projeto e adicione suas credenciais:

JavaScript

const firebaseConfig = {
  apiKey: "SEU_API_KEY",
  authDomain: "SEU_AUTH_DOMAIN",
  projectId: "SEU_PROJECT_ID",
  storageBucket: "SEU_STORAGE_BUCKET",
  messagingSenderId: "SEU_MESSAGING_SENDER_ID",
  appId: "SEU_APP_ID"
};
Abra o arquivo index.html no seu navegador. Você pode usar a extensão "Live Server" do VS Code para facilitar.

## 🤝 Contribuição
Contribuições são bem-vindas! Se você tiver sugestões, ideias para novas funcionalidades ou encontrar algum bug, por favor, abra uma issue ou envie um pull request.

## 📝 Licença
Este projeto está sob a licença MIT.
