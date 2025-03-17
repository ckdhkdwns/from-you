import React from 'react';
import ChannelTalk from '../../_channel-talk/channel-talk';

export default function layout({ children }: { children: React.ReactNode }) {
    return (
        <div>
            <ChannelTalk />
            {children}
        </div>
    );
}
