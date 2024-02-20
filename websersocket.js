import {
    f_websersocket_serve,
    f_v_before_return_response__fileserver
} from "https://deno.land/x/websersocket@0.2/mod.js"

let s_path_file_current = new URL(import.meta.url).pathname;
let s_path_folder_current = s_path_file_current.split('/').slice(0, -1).join('/');
// console.log(s_path_folder_current)

class O_ws_client{
    constructor(
        s_uuidv4,
        o_socket
    ){
        this.s_uuidv4 = s_uuidv4
        this.o_socket = o_socket
    }
}
let a_o_ws_client = []

class O_msg {
    constructor(
        s_js, 
        a_v_param
    ){
        this.s_js = s_js
        this.a_v_param = a_v_param
    }
}
let f_handler = async function(o_request){
    // important if the connection is secure (https),
    // the socket has to be opened with the wss:// protocol
    // from the client
    // for client: const socket = new WebSocket(`${window.location.protocol.replace('http', 'ws')}//${window.location.host}`);
    if(o_request.headers.get('Upgrade') == 'websocket'){

        const {
            socket: o_socket,
            response: o_response
        } = Deno.upgradeWebSocket(o_request);
        let o_ws_client = new O_ws_client(
            crypto.randomUUID(),
            o_socket
        )
        a_o_ws_client.push(o_ws_client);

        o_socket.addEventListener("open", (o_e) => {
            o_socket.send(JSON.stringify(
                new O_msg(
                    `
                        o_state.s_uuidv4 = '${o_ws_client.s_uuidv4}';
                        console.log(o_state)
                    `, 
                    []
                )
            ))
            
        });

        o_socket.addEventListener("message", async (o_e) => {
            let o_data = JSON.parse(o_e.data);
            a_o_ws_client
                // .filter(o=>o!=o_ws_client)
                .forEach(o=>{
                    o.o_socket.send(JSON.stringify(
                        new O_msg(
                            `
                                o_state.a_o_msg.push(
                                    {
                                        s_uuidv4: '${o_ws_client.s_uuidv4}',
                                        s_msg: \`${o_data.s_msg}\`, 
                                        n_ts_ms: ${new Date().getTime()}
                                    }
                                )
                                o_state?.o_js__a_o_msg?._f_render()
                            `, 
                            []
                        )
                    ))

                })
        });
        o_socket.addEventListener("close", async (event) => {
            a_o_ws_client.splice(a_o_ws_client.indexOf(o_ws_client), 1);
        });

        return o_response;
    }

    return f_v_before_return_response__fileserver(
        o_request,
        `${s_path_folder_current}/localhost/`
    )

}

await f_websersocket_serve(
    [
        {
            n_port: 8080,
            b_https: false,
            s_hostname: 'localhost',
            f_v_before_return_response: f_handler
        },
        {
            n_port: 8443,
            b_https: true,
            s_hostname: 'localhost',
            f_v_before_return_response: f_handler
        }
    ]
)