import { NavBar, Toast } from 'antd-mobile';
import { LeftOutline } from 'antd-mobile-icons';
import { history } from 'umi';
import * as InviteService from '@/services/invite';
import { useEffect, useState } from "react";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import inviteImg from '@/../public/staticfiles/Slice 91.png';
import slice60 from '@/../public/staticfiles/Slice 60.png';
import slice59 from '@/../public/staticfiles/Slice 59.png';

const Invite = () => {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [inviteList, setInviteList] = useState([]);
    const [deviceSn, setDeviceSn] = useState('');
    const [pageSize, setPageSize] = useState(50);
    const [page, setPage] = useState(1);
    const [selectedId, setSelectedId] = useState<number | null>(null); // 用于跟踪选中的ID

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const getInviteList = () => {
        InviteService.fetch(page, deviceSn, pageSize).then((res: TypeErrorCode) => {
            if (res.ErrorCode == 0) {
                setInviteList(res.Data);
            } else {
                Toast.show({
                    content: res.Data,
                });
            }
        });
    };
    useEffect(() => {
        getInviteList();
    }, []);
    // 点击处理函数
    const handleClick = (id: number) => {
        setSelectedId(id === selectedId ? null : id); // 如果点击的是已选中的项，则取消选中
    };
    const openDoor = () => {
        if (selectedId === null) {
            Toast.show({
                content: '请选择其中一个闸机',
            });
            return;
        } else {
            InviteService.remoteOpen(selectedId).then((res: TypeErrorCode) => {
                if (res.ErrorCode == 0) {
                    Toast.show({
                        content: '开门成功',
                    });
                } else {
                    Toast.show({
                        content: res.Data,
                    });
                }
            });
        }
    };
    const toQrcode = () => {
        history.push('/invite/inviteQrcode');
    };

    const getContainerStyle = () => ({
        padding: windowWidth <= 480 ? '8px' : '12px',
    });

    const getNavBarStyle = () => ({
        '--height': windowWidth <= 480 ? '40px' : '48px',
        '--border-bottom': 'none',
        '--background-color': '#fff',
        '--font-size': windowWidth <= 480 ? '14px' : '16px',
    });

    const getGridStyle = () => ({
        display: 'grid',
        // 确保无论屏幕大小，都以两张图片为一行
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: windowWidth <= 480 ? '8px' : '12px',
    });

    const getItemStyle = (isSelected: boolean) => ({
        padding: windowWidth <= 480 ? '8px' : '12px',
        border: `2px solid ${isSelected ? '#1890ff' : '#eee'}`,
        borderRadius: '8px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: '#fff',
        transition: 'all 0.2s ease',
        cursor: 'pointer',
        boxShadow: isSelected ? '0 4px 12px rgba(0,0,0,0.15)' : 'none',
    });


    const getImageStyle = () => ({
        // 调整宽度，使用百分比和 maxWidth 结合
        width: '100%',
        maxWidth: windowWidth <= 480 ? '150px' : '200px',
        height: 'auto',
        borderRadius: '4px',
        maxHeight: windowWidth <= 480 ? '80px' : '120px',
        objectFit: 'cover',
        marginBottom: windowWidth <= 480 ? '4px' : '8px',
    });

    const getTextStyle = () => ({
        margin: 0,
        fontSize: windowWidth <= 480 ? '0.875rem' : '1rem',
    });

    const getBottomBarStyle = () => ({
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        padding: windowWidth <= 480 ? '8px 16px' : '12px 30px',
        borderTop: '1px solid #eee',
        backgroundColor: '#fff',
    });

    const getIconStyle = () => ({
        width: windowWidth <= 480 ? '32px' : '40px',
        height: windowWidth <= 480 ? '32px' : '40px',
    });

    const getIconTextStyle = () => ({
        fontSize: windowWidth <= 480 ? '10px' : '12px',
        marginTop: windowWidth <= 480 ? '2px' : '4px',
    });

    return (
        <div style={getContainerStyle()}>
            <NavBar
                onBack={() => history.back()}
                style={getNavBarStyle()}
            />
            <div style={getGridStyle()}>
                {inviteList.map(item => (
                    <div
                        key={item.id}
                        style={getItemStyle(selectedId === item.id)}
                        onClick={() => handleClick(item.id)}
                    >
                        <img
                            src={inviteImg}
                            alt={item.position}
                            style={getImageStyle()}
                        />
                        <p style={getTextStyle()}>{item.position}</p>
                    </div>
                ))}
            </div>
            <div style={getBottomBarStyle()}>
                <div
                    style={{
                        textAlign: 'center',
                        cursor: 'pointer'
                    }}
                    onClick={openDoor}
                >
                    <img
                        src={slice59}
                        style={getIconStyle()}
                        alt="开门图标"
                    />
                    <div style={getIconTextStyle()}>立即开门</div>
                </div>
                <div style={{
                    width: '3px',
                    height: windowWidth <= 480 ? '28px' : '36px',
                    backgroundColor: '#666',
                    margin: '0 8px'
                }}></div>
                <div
                    style={{
                        textAlign: 'center',
                        cursor: 'pointer'
                    }}
                    onClick={toQrcode}
                >
                    <img
                        src={slice60}
                        style={getIconStyle()}
                        alt="邀请图标"
                    />
                    <div style={getIconTextStyle()}>访客邀请</div>
                </div>
            </div>
        </div>
    );
};

export default Invite;