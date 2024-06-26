import { useState } from 'react'
import { Button, Modal, Form, Input, InputNumber, message } from 'antd'
import { useAccount, useWriteContract } from 'wagmi'

import { LiuNFTAddress, marketplaceAddress } from '@contract/abi'
import { genNftFuncVars, genGalleryFuncVars } from '@utils/contract'

function SellButton() {
    const [dialogShown, setDialogShown] = useState(false)
    const { isConnected } = useAccount()
    const { writeContractAsync } = useWriteContract()
    const [form] = Form.useForm()
    const [messageApi, contextHolder] = message.useMessage()

    const handleSell = () => {
        if (!isConnected) {
            return messageApi.warning('Please connect wallet first.')
        }

        setDialogShown(true)
    }

    const handleClose = () => {
        form.resetFields()
        setDialogShown(false)
    }

    const handleSubmit = () => {
        const values = form.getFieldsValue()

        if (values.price === 0) {
            return messageApi.warning('NFT price can not be 0.')
        }

        writeContractAsync(genNftFuncVars('setApprovalForAll', [marketplaceAddress, true]))
            .then(() => writeContractAsync(genGalleryFuncVars('listItem', [LiuNFTAddress, values.tokenId, values.price]))
                .then(res => {
                    messageApi.success('上架成功')
                    handleClose()
                }).catch(err => {
                    messageApi.error('上架失败')
                })
            ).catch(err => {
                console.log('sell failed', err.message)
                messageApi.error('上架失败')
            })
    }

    return (
        <>
            {contextHolder}
            <Button type="primary" size="large" onClick={handleSell}>Sell</Button>
            <Modal title="Sell new NFT" open={dialogShown} onOk={() => form.submit()} onCancel={handleClose}>
                <Form form={form} labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} onFinish={handleSubmit}>
                    <Form.Item label="Contract">
                        {/* <Address address={RAIE_ADDR} ellipsis={{ headClip: 8, tailClip: 6 }} copyable /> */}
                        {LiuNFTAddress}
                    </Form.Item>
                    <Form.Item label="Token ID" name="tokenId" rules={[{ required: true, message: 'Please input NFT token ID!' }]}>
                        <InputNumber min={1} precision={0} addonBefore="#" style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item label="Price" name="price" rules={[{ required: true, message: 'Please input NFT price!' }]}>
                        <InputNumber min={0} addonAfter="RAIC" style={{ width: '100%' }} />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
}

export default SellButton
