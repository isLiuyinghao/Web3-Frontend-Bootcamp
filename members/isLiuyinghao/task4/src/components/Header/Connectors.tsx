import React from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';

import { CopyOutlined, CloseOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Button, Dropdown, Image } from 'antd';

export default function Connectors() {
    const { address, isConnected } = useAccount();
    const { connect, connectors } = useConnect();
    const { disconnect } = useDisconnect();
    // 钱包连接选项
    const connectorsItems: MenuProps['items'] = connectors.map((connector) => ({
        key: connector.id,
        label: (
            <Button type="text" onClick={() => connect({ connector })}>
                <Image
                    width={30}
                    height={30}
                    src="error"
                    fallback={connector.icon}
                />
                {connector.name}
            </Button>
        ),
    }));
    // 断开链接
    const items: MenuProps['items'] = [
        {
            key: '1',
            icon: <CopyOutlined />,
            label: (
                <p onClick={() => disconnect()}>复制地址</p>
            ),
        },
        {
            key: '3',
            icon: <CloseOutlined />,
            label: (
                <p onClick={() => disconnect()}>复制地址</p>
            ),
        },
    ];
    return (
        <div className='flex'>
            {isConnected ? (
                <>
                    <span className="hidden sm:block">
                        <Button onClick={() => disconnect()}>
                            <CopyOutlined />复制地址
                        </Button>
                    </span>
                    <span className="ml-3 hidden sm:block">
                        <Button onClick={() => disconnect()}>
                            <CloseOutlined />断开链接
                        </Button>
                    </span>
                </>
            ) : (
                <Dropdown menu={{ items: connectorsItems }}>
                    <Button>连接钱包</Button>
                </Dropdown>
            )}
        </div>
    )
};
