import { forwardRef } from 'react';

import classNames from "classnames";

const ArticlesButton = forwardRef((props, ref) => {

    const {
        size,
        variant,
        style,
        // Can just use small instead of size="sm"
        small,
        large,
        onClick,
        className,
        disabled,
        active,
        type,
        onMouseDown,
        onMouseUp,
        onMouseLeave,
        onTouchStart,
        onTouchEnd,
        ...rest
    } = props;

    return (
        <button
            ref={ref}
            {
                ...(type && {type: 'submit'})
            }
            disabled={disabled}
            style={style}
            onClick={onClick}
            onMouseDown={onMouseDown}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseLeave}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
            // data-react-component='true'
            className={
                classNames(
                    `btn ${variant ? `btn-${variant}` : 'btn-articles'}`,
                    {
                        [className]: className,
                        'btn-lg': large,
                        'btn-sm': small,
                        'active': active,
                        [`btn-${size}`]: size 
                    }
                )
            }
            {...rest}
        >
            {props.children}
        </button>
    )
});
ArticlesButton.displayName = 'ArticlesButton';

export default ArticlesButton;