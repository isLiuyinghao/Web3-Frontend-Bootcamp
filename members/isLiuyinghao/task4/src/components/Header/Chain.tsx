import React from 'react';
import { useAccount, useSwitchChain } from 'wagmi';
import { Spin, Select, Space } from 'antd';


export default function Header() {
    const { chains, switchChain } = useSwitchChain();
    const { chain } = useAccount();

    const handleChange = async (value: any) => {
        switchChain({ chainId: value })
    };

    return (
        <Space wrap>
            {chain ? (
                <>
                    <Select
                        defaultValue={chain.id}
                        style={{ width: 120 }}
                        onChange={handleChange}
                        options={chains.map((chain) => ({ label: chain.name, value: chain.id }))}
                    />
                </>
            ) : (
                <Spin />
            )}
        </Space>
    );
}
