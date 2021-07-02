import {ButtonHTMLAttributes} from 'react'
import '../styles/button.scss'
type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &{
    isOutlined?: boolean;
    cssClass?: string;
}

export function Button({ cssClass, isOutlined = false, ...props}: ButtonProps) {

    return (
        <button 
            className={`button ${isOutlined? 'outlined':''} ${cssClass}`} 
            {...props}
        />
    )
}
