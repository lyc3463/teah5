import React, { useState, useEffect } from 'react';
import { Button } from 'antd-mobile';
import {Drawer} from 'antd'
import type { MenuProps } from 'antd';
import {RightOutline, DownOutline, FileOutline, CloseOutline,UnorderedListOutline} from 'antd-mobile-icons'
// 定义菜单组件属性接口
interface SideMenuProps {
    menus: MenuProps['items']; // 菜单数据
    onSelect: (key: string) => void; // 菜单项点击回调
}

const SideMenu: React.FC<SideMenuProps> = ({ menus, onSelect }) => {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [expandedKeys, setExpandedKeys] = useState<string[]>([]); // 新增：展开的菜单key集合

    // 监听窗口大小变化（响应式）
    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    // 切换菜单展开/折叠状态
    const toggleExpand = (key: string, e: React.MouseEvent) => {
        e.stopPropagation(); // 阻止事件冒泡，避免触发菜单项点击
        setExpandedKeys(prev =>
            prev.includes(key)
                ? prev.filter(k => k !== key)
                : [...prev, key]
        );
    };

    // 菜单项样式
    const getMenuItemStyle = (isActive: boolean) => ({
        padding: '10px',
        color: isActive ? '#fff' : '#ccc',
        backgroundColor: isActive ? '#1890ff' : 'transparent',
        cursor: 'pointer',
        borderLeft: isActive ? '3px solid #1890ff' : 'none',
        transition: 'all 0.5s',
    });

    // 子菜单容器样式
    const getSubMenuStyle = () => ({
        paddingLeft: '20px',
        borderLeft: '1px dashed #444',
    });

    // 递归渲染菜单（支持展开/折叠）
    const renderMenuItems = (items: any[], level = 0) => {
        if (!items || items.length === 0) return null;

        // 核心修改1：移除过滤禁用项的逻辑，保留所有菜单项
        return items
            // .filter(item => !item.disabled) // 删除此行，不再过滤禁用项
            .map(item => {
                const hasChildren = item.children && item.children.length > 0;
                const isExpanded = expandedKeys.includes(item.key);

                // 核心修改2：不再过滤子项，保留所有子项（包括禁用项）
                // const filteredChildren = hasChildren ? item.children.filter((child: any) => !child.disabled) : [];
                const hasFilteredChildren = hasChildren; // 基于原始子项判断（不再过滤）

                return (
                    <div key={item.key} style={{ width: '100%' }}>
                        {/* 菜单项 - 禁用状态样式处理 */}
                        <div
                            style={{
                                ...getMenuItemStyle(window.location.pathname === item.key),
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                // 核心修改3：禁用项样式（灰色+不可点击）
                                opacity: item.disabled ? 0.5 : 1,
                                pointerEvents: item.disabled ? 'none' : 'auto', // 禁用点击事件
                                color: item.disabled ? '#999' : (window.location.pathname === item.key ? '#fff' : '#ccc') // 禁用时文字灰色
                            }}
                            onClick={(e) => {
                                if (item.disabled) return;

                                // 核心修改1：父级菜单点击触发展开/折叠
                                if (hasFilteredChildren) {
                                    toggleExpand(item.key,e); // 点击菜单项任意区域都能展开/折叠
                                } else {
                                    // 叶子菜单触发导航
                                    onSelect(item.key);
                                    if (windowWidth <= 480) setDrawerOpen(false);
                                }
                            }}
                        >
                            <span>{item.label}</span>

                            {/* 展开/折叠图标 - 禁用项不显示图标 */}
                            {!item.disabled && hasFilteredChildren && (
                                <div onClick={(e) => toggleExpand(item.key, e)}>
                                    <RightOutline size={16} />
                                </div>
                            )}
                        </div>

                        {/* 子菜单 - 递归渲染所有子项（包括禁用项） */}
                        {!item.disabled && hasFilteredChildren && (
                            <div style={{
                                ...getSubMenuStyle(),
                                maxHeight: isExpanded ? '500px' : '0',
                                opacity: isExpanded ? 1 : 0,
                                overflow: 'hidden',
                                transition: 'all 0.3s ease-in-out'
                            }}>
                                {renderMenuItems(item.children, level + 1)}
                            </div>
                        )}
                    </div>
                );
            });
    };
    // 桌面端菜单（固定左侧侧边栏，非抽屉）
    const renderDesktopMenu = () => (
        <div>
            <Button
                onClick={() => setDrawerOpen(true)}
                style={{
                    position: 'absolute',
                    top: '10px',
                    left: '10px',
                    zIndex: 20,
                    border:'none',
                    backgroundColor: 'transparent'
                }}
            >
                <UnorderedListOutline />
            </Button>
            <Drawer
                title={
                    <div>
                        <Button style={{border:'none',backgroundColor: 'transparent',color:'#fff'}} onClick={() => setDrawerOpen(false)}><CloseOutline /></Button>
                    </div>
                }
                closable={false}
                headerStyle={{ padding: 10, height: 0 }}
                open={drawerOpen}
                onOpenChange={setDrawerOpen}
                position="left"
                placement="left"
                style={{
                    width: '200px',
                    backgroundColor: '#001529',
                    zIndex: 15 // 确保抽屉在内容之上但在按钮之下
                }}
                transitionName="slide-left"
            >
                <div>
                    {renderMenuItems(menus)}
                </div>
            </Drawer>
        </div>
    );

    // 移动端菜单（抽屉式）
    const renderMobileMenu = () => (
        <>
            {/* 菜单触发器按钮 */}
            <Button
                onClick={() => setDrawerOpen(true)}
                style={{
                    position: 'absolute',
                    top: '10px',
                    left: '10px',
                    zIndex: 20,
                    border:'none',
                    backgroundColor: 'transparent'
                }}
            >
                <UnorderedListOutline />
            </Button>
            {/* 抽屉菜单 */}
            <Drawer
                headerStyle={{padding:'10px 10px 0 20px'}}
                title={
                    <div>
                        <Button style={{border:'none',backgroundColor: 'transparent',color:'#fff'}} onClick={() => setDrawerOpen(false)}><CloseOutline /></Button>
                    </div>
                }
                closable={false}
                open={drawerOpen}
                onOpenChange={setDrawerOpen}
                position="left"
                placement="left"
                style={{
                    width: '200px',
                    backgroundColor: '#001529',
                    zIndex: 15 // 确保抽屉在内容之上但在按钮之下
                }}
                // 添加抽屉弹出动画（Antd默认有，但可显式指定）
                transitionName="slide-left"
            >
                <div>
                    {renderMenuItems(menus)}
                </div>
            </Drawer>
        </>
    );

    // 根据屏幕宽度渲染不同菜单形式
    return windowWidth > 480 ? renderDesktopMenu() : renderMobileMenu();
};

export default SideMenu;