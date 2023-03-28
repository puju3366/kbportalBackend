export default {
    openapi: "3.0.1",
    info: {
        description: "",
        title: "",
        license: {
            name: "MIT License",
            url: "https://opensource.org/licenses/MIT",
        },
        version: "v1",
        servers: [
            {
                url: "http://localhost:3306",
            },
        ],
    },
    paths: {
        // kb APIs
        "/api/v1/kb/kb-getone/:id": {
            get: {
                tags: ["GetOneKB"],
                summary: "GetOneKB:-> this one is not user defined",
                operationId: "GetOneKB-NU",
                responses: {
                    "200": {
                        description: "",
                        headers: {},
                        params:""
                    },
                },
            },
        },

        "/api/v1/kb/myKB": {
            post: {
                tags: ["GetAllMyKb"],
                summary: "GetAllMyKb",
                operationId: "GetAllMyKb",
                responses: {
                    "200": {
                        description: "",
                        headers: {},
                    },
                },
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "json",
                                example: {
                                    email: "",
                                },
                            },
                            example: '{\r\n"email":"karan.chauhan@devitpl.com"}',
                        },
                    },
                },
            },
        },

        //   dashboard APIs
        "/api/v1/dashboard/getAllKbCount": {
            get: {
                tags: ["GetAllKbCount"],
                summary: "GetAllKbCount",
                operationId: "GetAllKbCount",
                responses: {
                    "200": {
                        description: "",
                        headers: {},
                    },
                },
            },
        },

        "/api/v1/users/login": {
            post: {
                tags: ["Login"],
                summary: "Login",
                operationId: "Login",
                parameters: [],
                responses: {
                    "200": {
                        description: "",
                        headers: {},
                    },
                },
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "json",
                                example: {
                                    title: "",
                                    category_id: "",
                                    practice_id: "",
                                    project_id: "",
                                    tag: "",
                                    body: "",
                                    is_draft: 1,
                                    created_by: "",
                                    expiry_date: ""
                                },
                            },
                            example: '{\r\n"title":"",\r\n"category_id":"",\r\npractice_id:"",\r\nproject_id:"",\r\ntag:"",\r\nbody:"",\r\nis_draft:1,\r\ncreated_by:"",\r\nexpiry_date:""}',
                        },
                    },
                },
            },
        },
    },
    components: {
        securitySchemes: {
            Bearer: {
                type: "apiKey",
                description:
                    "Input your Bearer token in this format - Bearer {your token here} to access this API",
                name: "Authorization",
                in: "header",
            },
        },
    },
    security: [
        {
            Bearer: ["Bearer"],
        },
    ],
}
