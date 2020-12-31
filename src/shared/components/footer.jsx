import React from 'react';

export default function Footer(props) {
    return (
        <footer>
            {props.children}

            <h2>Disclaimer</h2>
            <p>
              Due to limitations in Webpack&apos;s stats, the &quot;actual&quot; (minified) numbers
              reported here are approximate, but they should be pretty close.
            </p>
        </footer>
    );
}
