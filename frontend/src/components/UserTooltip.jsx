export default function UserTooltip ({children, isVisible, content, position = 'bottom'}) {
    return (
        <div className='tooltip-container'>
            {children}
            {isVisible && (
                <div className={`tooltip-box tooltip ${position}`}>
                    {content}
                </div>
            )}
        </div>
    );
}