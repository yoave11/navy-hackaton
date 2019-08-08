import axios from 'axios';

import { PLAYBACK_SERVICE_URL_TEST, PLAYBACK_SERVICE_URL } from './consts/env';

export default {
    async getData() {
        const response = await axios.get(PLAYBACK_SERVICE_URL,
            {
                params: {
                    t1: '1466400700',
                    t2: '1466400700'
                }
            }
        )
        this.parse(response);
    },
    async getDataTest() {
        const response = await axios.get(PLAYBACK_SERVICE_URL_TEST);
        console.log(response);
    }
}