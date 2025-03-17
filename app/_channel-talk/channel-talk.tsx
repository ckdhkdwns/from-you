'use client';

import React, { useEffect } from 'react';
import ChannelService from './channel-service';

export default function ChannelTalk() {

    useEffect(() => {
        const CT = new ChannelService();

        CT.boot({ pluginKey: process.env.NEXT_PUBLIC_CHANNEL_PLUGIN_KEY || '' });

        //for unmount
        return () => {
            CT.shutdown();
        };
    }, []);

    return <></>;
}
