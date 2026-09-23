import { Link, Outlet, useLocation, Navigate } from 'umi';
import styles from './index.less';
import * as ww from '@wecom/jssdk'
import { createGlobalStyle } from 'styled-components';
import 'weui/dist/style/weui.min.css';
import { fixPathname } from "@/utils/common";
import { StaticInfo } from "@/StaticInfo";
import 'antd-mobile/es/global'
import {ConfigProvider} from "antd";
import zhCN from 'antd/lib/locale/zh_CN';
import 'dayjs/locale/zh-cn';

// import { useSelectedRoutes } from '@/.umi/exports';


export default function Layout() {
    const umilocation = useLocation();
    const pathname = fixPathname(umilocation.pathname);
    console.log('pathname',pathname);
    // const mrs = useSelectedRoutes();
    // let is404 = mrs.some((o: any) => o.route.id == '404')
    // if (is404 && pathname!='/404.html') {
    //     return <Navigate to={`/404.html`} replace />
    // }
    // 未登录且当前不是登录页，跳转到登录页
    if (StaticInfo.userId === 0 && pathname !== '/login/') {
        return <Navigate to="/login/" />;
    }
    if (pathname == '/') {
        return <Navigate to={`/dashboard/`} replace />
    }
    // 已登录，正常渲染页面
    return (
        <div className={styles.navs}>
            <ConfigProvider locale={zhCN}>
                <Outlet />
            </ConfigProvider>
        </div>
    );
}