# Documentação da API de Leitura de Medidores

Esta API foi desenvolvida para gerenciar a leitura individualizada de consumo de água e gás através de imagens de medidores, utilizando IA para extrair os valores das medições.

## Endpoints

### POST `/upload`

Envia uma imagem do medidor em base64 para obter a medição via API do Google Gemini.

**Request Body**:

```json
{
    "image": "base64",
    "customer_code": "string",
    "measure_datetime": "datetime",
    "measure_type": " WATER ou GAS "
}
```

**Responses**:

| Status Code | Descrição                        | Resposta                                                                 |
|-------------|----------------------------------|--------------------------------------------------------------------------|
| 200         | Operação realizada com sucesso  | ```json { "image_url": "string", "measure_value": integer, "measure_uuid": "string" }``` |
| 400         | Dados inválidos                 | ```json { "error_code": "INVALID_DATA", "error_description": "descrição do erro" }``` |
| 409         | Leitura do mês já realizada     | ```json { "error_code": "DOUBLE_REPORT", "error_description": "Leitura do mês já realizada" }``` |

---

### PATCH `/confirm`

Confirma ou corrige o valor lido pelo LLM.

**Request Body**:

```json
{
    "measure_uuid": "string",
    "confirmed_value": "integer"
}
```

**Responses**:

| Status Code | Descrição                        | Resposta                                                                 |
|-------------|----------------------------------|--------------------------------------------------------------------------|
| 200         | Operação realizada com sucesso  | ```json { "success": true }```                                           |
| 400         | Dados inválidos                 | ```json { "error_code": "INVALID_DATA", "error_description": "descrição do erro" }``` |
| 404         | Leitura não encontrada          | ```json { "error_code": "MEASURE_NOT_FOUND", "error_description": "Leitura não encontrada" }``` |
| 409         | Leitura já confirmada           | ```json { "error_code": "CONFIRMATION_DUPLICATE", "error_description": "Leitura já confirmada" }``` |

---

### GET `/<customer_code>/list`

Lista as medidas realizadas por um cliente, com filtro opcional por tipo de medição.

**Query Parameters**:

- `measure_type` (opcional): `"WATER"` ou `"GAS"` (case insensitive)

**Exemplo de Request**:

```
GET /12345/list?measure_type=WATER
```

**Responses**:

| Status Code | Descrição                        | Resposta                                                                 |
|-------------|----------------------------------|--------------------------------------------------------------------------|
| 200         | Operação realizada com sucesso  | ```json { "customer_code": "string", "measures": [ { "measure_uuid": "string", "measure_datetime": "datetime", "measure_type": "string", "has_confirmed": boolean, "image_url": "string" } ] }``` |
| 400         | Tipo de medição inválido        | ```json { "error_code": "INVALID_TYPE", "error_description": "Tipo de medição não permitida" }``` |
| 404         | Nenhum registro encontrado      | ```json { "error_code": "MEASURES_NOT_FOUND", "error_description": "Nenhuma leitura encontrada" }``` |

---

## Considerações

- A API utiliza a API do Google Gemini para extrair valores das imagens dos medidores.
- Todas as rotas possuem validação de dados de entrada.
- O sistema evita duplicação de leituras no mesmo mês para o mesmo tipo de medição.
- Para iniciar a aplicação com a construção das imagens, rode o comando `docker-compose up --build` na raiz do projeto.
- A aplicação será executada na porta 80.