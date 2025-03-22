# Teste de Integração com Banco de Dados de Logs
Este teste de integração tem o objetivo de verificar a conexão da aplicação com a instância de banco de dados NoSQL MongoDB, o qual armazena logs do sistema acadêmico desenvolvido para o Centro de Paula Souza.

Por fins de execução do teste, uma aplicação simples para simular o comportamento do sistema real, a qual foi desenvolvida com as mesmas tecnologias, Node.js, TypeScript, Express e Mongoose, e que se conecta a uma instância MongoDB. A aplicação possui uma única rota ('/') que retorna a mensagem "Hello, world!". Um teste de integração, implementado com Jest e Supertest, o qual valida tanto a conexão com o MongoDB quanto a resposta da rota.

### Resumo
- Conectar à instância MongoDB: Utilizando Mongoose, com credenciais e parâmetros hardcoded.

- Configurar uma API com Express: Implementar uma rota simples ('/') que responde "Hello, world!".

- Realizar teste de integração: Garantir que a API funcione corretamente e que a conexão com o MongoDB esteja estabelecida, abortando a execução se o banco estiver indisponível.

### Estrutura de diretórios

```bash
integration-test-logs-db/
├── src/
│   ├── app.ts               # Configuração do Express: middlewares e definição da rota "/"
│   └── index.ts             # Ponto de entrada: conecta ao MongoDB e inicia o servidor Express
└── test/
    └── integration.test.ts  # Teste de integração com Jest e Supertest
├── docker-compose.yml       # Configuração do container MongoDB (com credenciais)
├── package.json             # Scripts e dependências (Express, Mongoose, TypeScript, Jest, ts-jest, Supertest)
├── tsconfig.json            # Configurações do compilador TypeScript (inclui rootDir e outDir)

```

### Funcionamento do Teste
#### Pré-condição:
- O MongoDB deve estar ativo (ou ser esperado que a falha na conexão interrompa o teste).

#### Procedimento:

- O hook beforeAll tenta conectar ao MongoDB usando Mongoose.

- Se a conexão falhar, o erro é logado e process.exit(1) interrompe a execução dos testes.

- Se a conexão for bem-sucedida, o teste prossegue e realiza uma requisição GET para / usando Supertest.

- O teste espera que o status HTTP seja 200 e o corpo da resposta seja "Hello, world!".

- O hook afterAll desconecta do MongoDB.

#### Resultado Esperado:

- Se o MongoDB estiver disponível, o teste retorna status 200 com "Hello, world!".

- Se o MongoDB não estiver disponível, os testes abortam imediatamente.

#### Pós-condição:
- A conexão com o MongoDB é encerrada após os testes, liberando recursos.

### Execução do Teste
A seguir, como executar o teste passo a passo:

1. **Preparar o Ambiente**

   - **Instalar as Dependências:**
     
     No diretório raiz do projeto, instale as dependências necessárias com:
     
     ```bash
     npm install
     ```
     
     > **Observação:** Certifique-se de que o Node.js e o npm estão instalados no seu sistema.

2. **Levantar a Instância do MongoDB via Docker**

   - **Arquivo Docker Compose:**
     
     O projeto já inclui o arquivo `docker-compose.yml`, que configura o container do MongoDB com as credenciais necessárias.
     
   - **Executar o Container:**
     
     No diretório raiz, execute o comando:
     
     ```bash
     docker-compose up -d
     ```
     
     Esse comando inicia o container em modo _detached_, ou seja, em segundo plano. Verifique que o container está ativo com:
     
     ```bash
     docker ps
     ```
     
     Você deverá ver um container rodando com a imagem do MongoDB.

3. **Executar os Testes Automatizados**

   - **Rodar o Script de Testes:**
     
     Com a instância do MongoDB ativa, execute o seguinte comando para rodar os testes:
     
     ```bash
     npm test
     ```
     
     Esse comando invoca o Jest, que:
     
     - Tenta conectar ao MongoDB usando a URI `mongodb://localhost:27017/testdb`.
     - Se a conexão for bem-sucedida, faz uma requisição GET para a rota `/` da aplicação Express.
     - Valida que a resposta possui status `200` e que o corpo da resposta é `"Hello, world!"`.
     
   - **Resultado Esperado:**
     
     - **Caso o MongoDB esteja ativo:**  
       Os testes serão executados com sucesso, exibindo mensagens de log indicando a conexão e desconexão do MongoDB, além da validação da rota.
     
     - **Caso o MongoDB não esteja ativo:**  
       O hook `beforeAll` falhará na conexão, imprimindo o erro e abortando o processo com `process.exit(1)`. O Jest encerrará com um código de erro, indicando que o ambiente de testes não está adequado.

4. **Encerramento**

   - **Finalizar o Container (Opcional):**
     
     Após os testes, se desejar interromper o container do MongoDB, execute:
     
     ```bash
     docker-compose down
     ```
     
     Esse comando para e remove o container, liberando os recursos.

### Observações
#### Credenciais "Expostas" no Docker Compose:
Para simplificar o processo de execução dos testes em um ambiente controlado, as credenciais e demais parâmetros (usuário, senha, host, porta e nome do banco) estão expostos no código, eliminando a dependência de um arquivo .env. Dessa forma, espera-se que o usuário que desejar testar de forma local a criação da aplicação, da instância do MongoDB e do teste de conexão pode o fazer sem a preocupação das credenciais.

#### Comportamento no Ambiente de Teste:
O uso de process.exit(1) no hook beforeAll assegura que, caso a conexão com o MongoDB falhe, o processo de testes seja imediatamente abortado, evitando timeouts e execuções parciais que não reflitam a integridade da integração.