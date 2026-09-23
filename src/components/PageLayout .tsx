import { NavBar } from "antd-mobile";
import useResponsive from "@/components/UseResponsive";

const PageLayout = ({title,onBack,children})=>{

    const { navBarStyle,pageContainerStyle } = useResponsive();

    return(
        <div style={pageContainerStyle}>
            <NavBar style={navBarStyle} onBack={onBack}>
                {title}
            </NavBar>

            {children}
        </div>
    )
}

export default PageLayout