import React from 'react'
import dati from '~/utils/populated_list'
import axios from 'axios';
import Client from './client';

// const fetchHtmlResponses = async (urls: string[]): Promise<{ url: string, match: string }[]> => {
//     const responses = await Promise.all(urls.map(async (url) => {
        

//         try {
//             const response = await axios.get(`${url}`, {
//                 headers: {
//                     'Content-Type': 'text/html',
//                 }
//             });
//             const { data } = response;
//             const match = data.match(/<div class="titolo">Aree di ricerca<\/div>([\s\S]*?)<\/div>/);
//             return {
//                 url,
//                 match: match ? match[1].trim().replace(/<div class="contenuto" style="font-family: monospace; padding: 0.5em;">([\s\S]*?)/g, '') : ''
//             };
//         } catch (error) {
//             console.error(`Error fetching URL ${url}:`, error);
//             return {
//                 url,
//                 match: ''
//             };
//         }       
//     }));
//     return responses;
// };

const Search = async () => {
    // const urls = profList.map((prof) => prof);
    // const first_ten = urls.slice(0, 20);

    // const complete_dati = []
    // const iterations = Math.ceil(profList.length / 10);

    // const n = 223
    // const to = n + 50

    // // for (let i = n; i < to; i++) {
    // //     const start = i * 10;
    // //     const end = start + 10;
    //     const currentBatch = urls.slice(n, to);

    //     const batchData = await fetchHtmlResponses(currentBatch)
    //     console.log("completed batch", n);
    //     setTimeout(() => { }, 1000);
    //     complete_dati.push(...batchData);
    // // }


    // if (!complete_dati) {
    //     return <div>loading...</div>
    // }

    return (
        <div
            className='w-full h-full'
        >
            <Client
                dati={dati}
            />
        </div>
    )
}

export default Search
