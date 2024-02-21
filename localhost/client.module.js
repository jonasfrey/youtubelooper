
import {
    f_o_js as f_o_js__tooltip
} from "https://deno.land/x/f_o_html_from_o_js@2.8/localhost/jsh_modules/tooltip/mod.js"



import {
    f_display_test_selection_or_run_selected_test_and_print_summary,
    f_o_test
} from "https://deno.land/x/deno_test_server_and_client_side@1.1/mod.js"

import {
    f_add_css,
    f_s_css_prefixed,
    o_variables, 
    f_s_css_from_o_variables
} from "https://deno.land/x/f_add_css@1.1/mod.js"

import {
    O_vec2
} from "https://deno.land/x/vector@0.8/mod.js"

let f_a_n_hmsms_from_n_ms = function(n_ms){
    let n_ms_mod = n_ms % 1000;
    let n_seconds = n_ms / 1000
    let n_seconds_mod = n_seconds % 60;
    let n_minutes = n_seconds / 60
    let n_minutes_mod = n_minutes % 60
    let n_hours = n_minutes / 60
    let n_hours_mod = n_hours 
    return [
        n_hours, 
        n_minutes_mod, 
        n_seconds_mod, 
        n_ms_mod
    ]
}
let f_s_time_from_n_ms = function(n_ms){
    let [ 
        n_hours,
        n_minutes_mod,
        n_seconds_mod,
        n_ms_mod
    ] = f_a_n_hmsms_from_n_ms(n_ms);
    return [
        (parseInt(n_hours) > 0) ? parseInt(n_hours).toString().padStart(2, '0') : false,
        (parseInt(n_minutes_mod) > 0) ? parseInt(n_minutes_mod).toString().padStart(2, '0') : false,
        (parseInt(n_seconds_mod) > 0) ? parseInt(n_seconds_mod).toString().padStart(2, '0') : false,
        (parseInt(n_ms_mod) > 0) ? parseInt(n_ms_mod).toString().padStart(2, '0') : false,
    ].filter(v=>v).join(':')
}
let f_o_trn__relative_to_o_html = function(
    o_trn_mouse, 
    o_el
){
    const o_brect  = o_el.getBoundingClientRect();
    
    return o_trn_mouse.sub(o_brect.left, o_brect.top); 
    
}
let f_o_trn__relative_to_o_html__nor = function(
    o_trn_mouse, 
    o_el
){
    const o_brect  = o_el.getBoundingClientRect();
    
    let o_trn = new O_vec2(o_brect.left, o_brect.top);
    let o_scl = new O_vec2(o_brect.width, o_brect.height);
    return o_trn_mouse.sub(o_trn).div(o_scl); 
    
}

o_variables.n_rem_font_size_base = 1. // adjust font size, other variables can also be adapted before adding the css to the dom
o_variables.n_rem_padding_interactive_elements = 0.5; // adjust padding for interactive elements 
f_add_css(
    `
    body{

    }
    .abs_centered{
        position: absolute;
        left: 50%;
        transform: translate(-50%, 0%);
    }
    .app{
        width:80%;
        margin: 0 auto;
    }
    .loop_position_inputs input{
        width: 50px;
    }
    .timeline {
        background: rgba(0,0,0,0.2);
    }
    .cursor{
        height: 100%;
        left: 50%;
        position: absolute;
        width: 5px;
        transform: translate(-50%, 0%);
        border-right: 2px dotted black;
    }
    ${
        f_s_css_from_o_variables(
            o_variables
        )
    }
    `

);


import {
    f_o_html__and_make_renderable,
}
from 'https://deno.land/x/f_o_html_from_o_js@2.7/mod.js'


let f_s_video_id__from_s_url = function(s_url){
    // Regular expression to match various YouTube URL formats
    const o_regex = /^.*(youtu\.be\/|v\/|e\/|u\/\w+\/|embed\/|v=)([^#\&\?]*).*/;
    const a_v_match = s_url.match(o_regex);
  
    // Check if the URL matches the YouTube URL pattern
    if (a_v_match && a_v_match[2].length === 11) {
      // Return the YouTube video ID
      return a_v_match[2];
    } else {
      // If no match is found or the video ID length is not 11 characters, return an error or null
      return null;
    }
  }

let n_id_raf = 0;
let n_ms_max = 1000/24;
let n_ms_wpn = 0;
let n_ms_wpn_last = 0;
let f_raf = function(){
    n_id_raf = window.requestAnimationFrame(f_raf);
    //
    n_ms_wpn = window.performance.now();
    if((n_ms_wpn - n_ms_wpn_last) > n_ms_max){
        o_state?.o_js__playhead?._f_update?.()
        n_ms_wpn_last = n_ms_wpn
        if(o_state.b_yt_video_playing){
            o_state.n_ms__tmp = window?.o_state?.o_youtube_iframe_api_player?.getCurrentTime?.() * 1000
            // the sliders could get switched up by the user
            let n_ms_loop_max = Math.max(o_state.n_ms__start_loop,o_state.n_ms__end_loop)
            let n_ms_loop_min = Math.min(o_state.n_ms__start_loop,o_state.n_ms__end_loop)
            if(
                window?.o_state?.o_youtube_iframe_api_player?.getCurrentTime?.() * 1000 > n_ms_loop_max
            ){
                window.o_state.o_youtube_iframe_api_player.seekTo(
                    n_ms_loop_min/1000
                );
            }
        }
        
    }
}
n_id_raf = window.requestAnimationFrame(f_raf);


let o_state = {
    s_url: '', 
    s_video_id: null, 
    n_ms__tmp: 0,
    n_ms__start_loop: 0,
    n_ms__end_loop: 10000, 
    b_pointer_down_start: false, 
    b_pointer_down_end: false, 
    b_pointer_over_start_end: false, 
    b_pointer_over_start_end_last: false, 
    o_state_for__tooltip: {}
}
window.o_state = o_state

let f_update_video_from_s_id = function(s_id){
    o_state.s_video_id = s_id
    window.o_state.o_youtube_iframe_api_player.loadVideoById(o_state.s_video_id)
    // window.o_state.o_youtube_iframe_api_player.pauseVideo()
    f_update_url_hash()


}
let f_update_url_hash = function(){
    let n_ms_loop_max = Math.max(o_state.n_ms__start_loop,o_state.n_ms__end_loop)
    let n_ms_loop_min = Math.min(o_state.n_ms__start_loop,o_state.n_ms__end_loop)

    let o = {
        s_video_id: o_state.s_video_id, 
        n_ms__start_loop:n_ms_loop_min,
        n_ms__end_loop:n_ms_loop_max
    }
    window.location.href = `${window.location.origin}${window.location.pathname}#${
        Object.keys(o).map(s=>{
            return `${s}=${o[s]}` 
        }).join('&')
    }`
}
window.f_try_loading_from_url = function(){
//   http://localhost:8080/#v=M7lc1UVf-VE&n_ms__start_loop=364671.5437374866&n_ms__end_loop=508466.173972531
    let s = window.location.href.split('#').slice(1).join('#')
    Object.assign(
        o_state, 
        ...s.split('&').map(s2=>{
            let a_s = s2.split('=')
            let s_prop = a_s[0];
            let s_val = a_s[1];
            return {
                [s_prop]: (s_prop.indexOf('n') == 0) ? parseFloat(s_val) : s_val
            }
        })
    )
    // console.log(o_state)
    f_update_video_from_s_id(o_state.s_video_id);
    

}

window.onYouTubeIframeAPIReady = function() {
    console.log(parseInt(window.innerWidth*0.8))
  window.o_state.o_youtube_iframe_api_player = new YT.Player('player', {
    height: '400',
    width: '500',
    // width: parseInt(window.innerWidth*0.8),
    // videoId: 'M7lc1UVf-VE',
    // videoId: '',
    playerVars: {
      'playsinline': 1
    },
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange, 
    //   'onSeek': ()=>{alert('asdf');console.log('seek')}, //not existing
    //   'onSeeking': ()=>{alert('asdf');console.log('seeking')}
    }
  });

}


// // 4. The API will call this function when the video player is ready.
function onPlayerReady(event) {
    //   event.target.playVideo();
    o_state.n_ms__end_loop = o_state.o_youtube_iframe_api_player.playerInfo.duration*1000.;
    o_state.o_js__end_loop._f_update()
    f_try_loading_from_url()
    console.log('player ready')
}

// // 5. The API calls this function when the player's state changes.
// //    The function indicates that when playing a video (state=1),
// //    the player should play for six seconds and then stop.
var done = false;
function onPlayerStateChange(o_e) {

    if(o_e.data == YT.PlayerState.BUFFERING){}
    if(o_e.data == YT.PlayerState.CUED){}
    if(o_e.data == YT.PlayerState.ENDED){}
    if(o_e.data == YT.PlayerState.PAUSED){}
    if(o_e.data == YT.PlayerState.PLAYING){}
    if(o_e.data == YT.PlayerState.UNSTARTED){}
    o_state.b_yt_video_playing = o_e.data == YT.PlayerState.PLAYING;
    o_state.b_yt_video_paused = o_e.data == YT.PlayerState.PAUSED;

    window.setTimeout(()=>{
        ['start', 'end'].forEach(s=>{
            o_state[`o_js__${s}_loop`]._f_render()
            o_state[`o_js__inputs_${s}_loop`]._f_render();
        })
    },100)
    console.log({
        s: 'state change', 
        o_e
    })
}

document.body.appendChild(
    await f_o_html__and_make_renderable(
        {
            s_tag: 'div', 
            class: "app",
            a_o: [
                
                f_o_js__tooltip(o_state.o_state_for__tooltip),
                {
                    s_tag: "label", 
                    innerText: "video url"
                },
                {
                    s_tag: "input", 
                    style: "width: 100%",
                    oninput: (o_e)=>{
                        o_state.s_url = o_e.target.value;
                        let s_id = f_s_video_id__from_s_url(o_state.s_url);
                        f_update_video_from_s_id(s_id);
                        // o_state?.o_js__video?._f_render();
                    }, 
                    data_tooltip: 'enter the video url here'
                },
                {
                    style: "width: 100%",
                    id: "player"
                },
                {
                    s_tag: 'script', 
                    src: "https://www.youtube.com/iframe_api"
                },
                // Object.assign(
                //     o_state, 
                //     {
                //         o_js__video: {
                //             f_o_jsh:()=>{
                //                 return {

                //                     frameborder: 0,
                //                     allowfullscreen: true, 
                //                     allow: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share',
                //                     s_tag: 'iframe', 
                //                     src: `https://www.youtube.com/embed/${o_state.s_video_id}`
                //                 }
                //             }
                //         }
                //     }
                // ).o_js__video,
                {
                    class: "timeline", 
                    data_tooltip: [
                        `click to change start or end`, 
                    ].join('<br>'),
                    style: 'width:100%;position:relative;height:2rem',
                    a_o: [
                        ...['start', 'end'].map(s=>{
                            return Object.assign(
                                o_state, 
                                {
                                    [`o_js__${s}_loop`]: {
                                        f_o_jsh:()=>{
                                            return {
                                                data_tooltip: [
                                                    `${s} of loop`, 
                                                    `drag to change`, 
                                                ].join('<br>'),
                                                style: [
                                                    'height: 100%',
                                                    'width:3rem',
                                                    'background:rgba(132,33,193,0.5)', 
                                                    `left: ${(o_state[`n_ms__${s}_loop`] / 1000) / o_state?.o_youtube_iframe_api_player?.playerInfo?.duration
                                                    *100}%`, 
                                                    'position: absolute',
                                                    `transform: translate(-50%, 0%)`
                                                ].join(';'), 
                                                class: [
                                                    `playhead`, 
                                                    s
                                                ].join(' '),
                                                onpointerdown: ()=>{
                                                    o_state[`b_pointer_down_${s}`] = true
                                                    console.log(o_state[`b_pointer_down_${s}`])
                                                },
                                                onpointerup: ()=>{
                                                    o_state[`b_pointer_down_${s}`] = false
                                                }, 
                                                a_o:[
                                                    {
                                                        class: "cursor"
                                                    },
                                                    {
                                                        class: "abs_centered",
                                                        innerText: f_s_time_from_n_ms(o_state[`n_ms__${s}_loop`]) 
                                                    }
                                                ]
                                            }
                                        }
                                    }
                                }
                            )[`o_js__${s}_loop`]
                        }),
                        Object.assign(
                            o_state, 
                            {
                                o_js__playhead: {
                                    f_o_jsh:()=>{
                                        return {
                                            style: [
                                                'position: absolute',
                                                'height: 100%',
                                                'width:3px',
                                                'background:red', 
                                                `left: ${window?.o_state?.o_youtube_iframe_api_player?.getCurrentTime?.() / o_state?.o_youtube_iframe_api_player?.playerInfo?.duration
*100}%`,
                                                `transform: translate(-50%, 0%)`

                                            ].join(';'), 
                                            class: "playhead"
                                        }
                                    }
                                }
                            }
                        ).o_js__playhead,
                    ], 
                    onpointerdown: (o_e)=>{

                        if(o_state?.o_youtube_iframe_api_player?.playerInfo?.duration){

                            let o_trn_nor = f_o_trn__relative_to_o_html__nor(
                                new O_vec2(o_e.clientX,o_e.clientY),
                                document.querySelector('.timeline')
                            );
                            let n_ms = o_trn_nor.n_x * o_state?.o_youtube_iframe_api_player?.playerInfo?.duration*1000.;
                            console.log(n_ms);
                            
                            let o_closer = new Array("start", "end").map(s => {
                                return {
                                    s: s, 
                                    n_ms_delta:Math.abs(o_state[`n_ms__${s}_loop`] - n_ms)
                                }
                            }).sort((o1,o2)=>{
                                return o1.n_ms_delta - o2.n_ms_delta
                            })[0];
                            console.log(o_closer)
                            
                            o_state[`n_ms__${o_closer.s}_loop`] = n_ms;
                            o_state[`o_js__${o_closer.s}_loop`]._f_render()
                            o_state[`o_js__inputs_${o_closer.s}_loop`]._f_render();
                        }

                    }
                },
                {
                    class: 'loop_position_inputs',
                    style: [
                        `display: flex;`,
                        // `align-items: center`,
                        `flex-direction: row`,
                        `justify-content: space-between`
                    ].join(';'),
                    a_o: [
                        ...['start', 'end'].map(s=>{
                            return Object.assign(
                                o_state, 
                                {
                                    [`o_js__inputs_${s}_loop`]: {
                                        f_o_jsh:()=>{
                                            let [ 
                                                n_hours,
                                                n_minutes_mod,
                                                n_seconds_mod,
                                                n_ms_mod
                                            ] = f_a_n_hmsms_from_n_ms(o_state[`n_ms__${s}_loop`]);
                                            n_hours = parseInt(n_hours)
                                            n_minutes_mod = parseInt(n_minutes_mod)
                                            n_seconds_mod = parseInt(n_seconds_mod)
                                            n_ms_mod = parseInt(n_ms_mod)
                                            return {
                                                a_o: [
                                                    {
                                                        innerText: "Hours Minutes Seconds Milliseconds H:M:S:MS"
                                                    },
                                                    {
                                                        style: [
                                                            `display: flex;`,
                                                            `align-items: center;`,
                                                        ].join(';'),
                                                        a_o: [
                                                            {
                                                                s_tag: 'input', 
                                                                type: 'number',
                                                                value: (n_hours), 
                                                                oninput: (o_e)=>{
                                                                    n_hours = parseInt(o_e.target.value);
                                                                    o_state[`n_ms__${s}_loop`] = 
                                                                        n_hours * 1000*60*60
                                                                        + n_minutes_mod * 1000 * 60
                                                                        + n_seconds_mod * 1000
                                                                        + n_ms_mod 
                                                                    o_state[`o_js__${s}_loop`]._f_render()

                                                                }
                                                            }, 
                                                            {innerText: ":"},
                                                            {
                                                                s_tag: 'input', 
                                                                type: 'number',
                                                                value: (n_minutes_mod), 
                                                                oninput: (o_e)=>{
                                                                    n_minutes_mod = parseInt(o_e.target.value);
                                                                    o_state[`n_ms__${s}_loop`] = 
                                                                        n_hours * 1000*60*60
                                                                        + n_minutes_mod * 1000 * 60
                                                                        + n_seconds_mod * 1000
                                                                        + n_ms_mod 
                                                                    o_state[`o_js__${s}_loop`]._f_render()

                                                                }
                                                            }, 
                                                            {innerText: ":"},
                                                            {
                                                                s_tag: 'input', 
                                                                type: 'number',
                                                                value: (n_seconds_mod), 
                                                                oninput: (o_e)=>{
                                                                    n_seconds_mod = parseInt(o_e.target.value);
                                                                    o_state[`n_ms__${s}_loop`] = 
                                                                        n_hours * 1000*60*60
                                                                        + n_minutes_mod * 1000 * 60
                                                                        + n_seconds_mod * 1000
                                                                        + n_ms_mod 
                                                                    o_state[`o_js__${s}_loop`]._f_render()

                                                                }
                                                            }, 
                                                            {innerText: ":"},
                                                            {
                                                                s_tag: 'input', 
                                                                type: 'number',
                                                                step: 15,
                                                                value: (n_ms_mod), 
                                                                oninput: (o_e)=>{
                                                                    if(o_e.target.value < 0){
                                                                        o_e.target.value = 1000;
                                                                    }
                                                                    if(o_e.target.value > 1000){
                                                                        o_e.target.value = 0;
                                                                    }
                                                                    n_ms_mod = parseInt(o_e.target.value);

                                                                    o_state[`n_ms__${s}_loop`] = 
                                                                        n_hours * 1000*60*60
                                                                        + n_minutes_mod * 1000 * 60
                                                                        + n_seconds_mod * 1000
                                                                        + n_ms_mod 
                                                                    o_state[`o_js__${s}_loop`]._f_render()

                                                                    window.o_state.o_youtube_iframe_api_player.seekTo(
                                                                        o_state[`n_ms__${s}_loop`]/1000.
                                                                    );
                                                                    window.o_state.o_youtube_iframe_api_player.pauseVideo()

                                                                }
                                                            }, 
                                                        ]
                                                    }
                                                ]
                                            }
                                        }
                                    }
                                }
                            )[`o_js__inputs_${s}_loop`]
                        }),
                    ]

                }
            ]
        }
    )
);
document.addEventListener('pointerup', ()=>{
    o_state.b_pointer_down_start = false
    o_state.b_pointer_down_end = false
})
document.addEventListener('pointermove', (o_e)=>{


    let o_trn_nor = f_o_trn__relative_to_o_html__nor(
        new O_vec2(o_e.clientX,o_e.clientY),
        document.querySelector('.timeline')
    )
    o_state.b_pointer_over_start_end = false;
    // console.log(o_trn_nor)
    new Array("start", "end").forEach(s => {

        if(o_e.target.closest(`.playhead.${s}`)){
            o_state.b_pointer_over_start_end = true;

            window.o_state.o_youtube_iframe_api_player.seekTo(
                o_state[`n_ms__${s}_loop`]/1000.
            );
            o_state.b_yt_video_playing_last = o_state.b_yt_video_playing
            window.o_state.o_youtube_iframe_api_player.pauseVideo()
        }
        if(o_state[`b_pointer_down_${s}`]){
            let n_max = o_state?.o_youtube_iframe_api_player?.playerInfo?.duration
            o_state[`n_ms__${s}_loop`] = Math.max(
                Math.min(
                    n_max*1000,
                    n_max * o_trn_nor.n_x * 1000.
                ),
                0.
            );
            f_update_url_hash()
            o_state[`o_js__${s}_loop`]._f_render()
            window.o_state.o_youtube_iframe_api_player.seekTo(
                o_state[`n_ms__${s}_loop`]/1000.
            );
            window.o_state.o_youtube_iframe_api_player.pauseVideo()
        }
    });
    if(
        !o_state.b_pointer_over_start_end && o_state.b_pointer_over_start_end_last 
    ){

        window.o_state.o_youtube_iframe_api_player.seekTo(
            o_state.n_ms__tmp / 1000.
        );

        if(o_state.b_yt_video_playing_last){
            window.o_state.o_youtube_iframe_api_player.playVideo()
        }else{
            window.o_state.o_youtube_iframe_api_player.pauseVideo()
        }

    }
    o_state.b_pointer_over_start_end_last = o_state.b_pointer_over_start_end;
    
    // let n_x_nor = o_e.clientX / window.innerWidth;
    // if(window?.o_state?.o_youtube_iframe_api_player?.playerInfo?.videoData?.video_id){
    //     let n_max = window.o_state.o_youtube_iframe_api_player.getDuration();
    //     window.o_state.o_youtube_iframe_api_player.seekTo(n_max * n_x_nor);
    //     window.o_state.o_youtube_iframe_api_player.pauseVideo()

    // }
    // window.o_state.o_youtube_iframe_api_player.stopVideo() 
})

