import {
    f_display_test_selection_or_run_selected_test_and_print_summary,
    f_o_test
} from "https://deno.land/x/deno_test_server_and_client_side@1.1/mod.js"

//readme.md:start
//md: ![./logo_wide.png](./logo_wide.png)
//readme.md:end

//./readme.md:start
//md: # changelog
//md: 
//./readme.md:end


import {
    f_o_html__and_make_renderable,
}
from 'https://deno.land/x/f_o_html_from_o_js@2.7/mod.js'


// Determine the current domain
const s_hostname = window.location.hostname;

// Create the WebSocket URL, assuming ws for http and wss for https
const s_protocol_ws = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
const s_url_ws = `${s_protocol_ws}//${s_hostname}:${window.location.port}`;

// Create a new WebSocket instance
const o_ws = new WebSocket(s_url_ws);

// Set up event listeners for your WebSocket
o_ws.onopen = function(o_e) {
    console.log('WebSocket is open now.');
};

o_ws.onerror = function(o_e) {
    console.error('WebSocket error observed:', o_e);
};

o_ws.onmessage = function(o_e) {

    let o = JSON.parse(o_e.data);
    console.log(o.s_js)
    let f = new Function('o_state',o.s_js);
    console.log(f)
    f(o_state);
    // console.log( typeof o_e.data);
};
// To send a message to the server
// o_ws.send('Your message here');

// To close the WebSocket
// o_ws.close();

let o_state = {
    s_msg: '', 
    a_o_msg: []
}
window.o_state = o_state
let f_send_msg = function(){
    console.log(o_state)
    if(o_state?.s_msg?.trim() != ''){
        o_ws.send(
            JSON.stringify(
                {
                    s_msg: o_state.s_msg
                }
            )
        )
        o_state.s_msg = '';
        o_state?.o_js__msg_input?._f_update();
    }
}
window.addEventListener('keydown', (o_e)=>{
    if(o_e.key == 'Enter'){
        f_send_msg()
    }
})
// //readme.md:start
document.body.appendChild(
    await f_o_html__and_make_renderable(
        {
            s_tag: 'div', 
            a_o: [
                Object.assign(
                    o_state, 
                    {
                        o_js__a_o_msg: {
                            f_o_jsh: ()=>{
                                return {
                                    a_o: [
                                        o_state.a_o_msg.map(o=>{
                                            return {
                                                style: [
                                                    'display:flex',
                                                    'flex-direction:row',
                                                    `justify-content: ${(o.s_uuidv4 == o_state.s_uuidv4) ? 'end' : 'start'}`,
                                                    'align-items:end'
                                                ].join(';'),
                                                a_o: [
                                                    {
                                                        innerText: o.s_msg
                                                    },
                                                    {
                                                        style: 'color: darkgray;padding-left: 1rem; font-size:10px',
                                                        innerText: new Date(o.n_ts_ms).toISOString()
                                                    }
                                                ]
                                            }
                                        })
                                    ]
                                }
                            }
                        }
                    }
                ).o_js__a_o_msg,
                Object.assign(
                    o_state, 
                    {
                        o_js__msg_input: {
                            f_o_jsh: ()=>{
                                return {
                                    s_tag: 'textarea', 
                                    value: o_state.s_msg,
                                    oninput: (o_e)=>{
                                        o_state.s_msg = o_e.target.value;
                                    }, 
                                    //if no 's_tag' is set, the element will be a 'div' element
                                    innerText: "i am a DIV!"
                                }
                            }
                        }
                    }
                ).o_js__msg_input,
                {
                    s_tag: 'button', 
                    innerText: "Send !", 
                    onclick: ()=>{
                        f_send_msg()
                    }
                }, 
            ]
        }
    )
);
// //readme.md:end