import toast from "react-hot-toast";


export class ApiClient {

    static instance = null
    baseUrl = "http://localhost:3000"


    jwt = "";
    headers = {
        "Content-Type": "application/json"
    }

    constructor() {
        if(ApiClient.instance != null) {
            throw new Error("ApiClient já foi instanciado!!!")
        }
    }

    static getInstance() {
        if(ApiClient.instance == null) {
            ApiClient.instance = new ApiClient();
        }
        return ApiClient.instance;
    }

static setJwt(jwt) {
    ApiClient.instance.jwt = jwt;

    if (jwt) {
        ApiClient.instance.headers["Authorization"] = `Bearer ${jwt}`;
    } else {
        delete ApiClient.instance.headers["Authorization"];
    }
}



    async get(endpoint) {
        const response = await fetch(this.baseUrl + endpoint, {
            method: "GET",
            headers: this.headers,
            credentials: 'include',
        })

        return await this.checarResposta(response);
    }

    async post(endpoint, body) {
        const response = await fetch(this.baseUrl + endpoint, {
            method: "POST",
            headers: this.headers,
            credentials: 'include',
            body: JSON.stringify(body)
        })

        return await this.checarResposta(response);
    }

    async put(endpoint, body) {
        const response = await fetch(this.baseUrl + endpoint, {
            method: "PUT",
            headers: this.headers,
            credentials: 'include',
            body: JSON.stringify(body)
        })

        return await this.checarResposta(response);
    }

    async delete(endpoint) {
        const response = await fetch(this.baseUrl + endpoint, {
            method: "DELETE",
            credentials: 'include',
            headers: this.headers
        })

        return await this.checarResposta(response);
    }

    async patch(endpoint, body) {
        const response = await fetch(this.baseUrl + endpoint, {
            method: "PATCH",
            headers: this.headers,
            credentials: 'include',
            body: JSON.stringify(body)
        })

        return await this.checarResposta(response);
    }

    async postFormData(endpoint, body) {
        const response = await fetch(this.baseUrl + endpoint, {
            method: "POST",
            credentials: 'include',
            body: body
        })

        return await this.checarResposta(response);
    }

    async checarResposta(response) {
    let texto = await response.text(); // <<< NÃO QUEBRA

    let json = null;
    try {
        json = texto ? JSON.parse(texto) : null; // <<< TENTA DECODIFICAR
    } catch (e) {
        json = null; // JSON inválido → ignora
    }

    if (response.ok) {
        return json; // pode ser null e tudo bem!
    }

    // ERRO
    console.log(`Erro HTTP: ${response.status}`, json);

    if (response.status != 401) {
        toast.error(json?.msg || `Erro ao realizar requisição! HTTP ${response.status}`);
    }

    return null;
}

}

export const apiClient = ApiClient.getInstance();