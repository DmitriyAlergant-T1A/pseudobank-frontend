import {DeepChat} from 'deep-chat-react';

import React, {useState} from 'react';

function PseudobankDeepChatComponent({ chatElementRef }) {

    const [isChatVisible, setIsChatVisible] = useState(false);

    return (
            <>
                    {isChatVisible && (
                        <div
                            style={{
                                position: 'fixed',
                                right: '20px',
                                bottom: '60px', // Adjust based on your toggle button's size and desired spacing
                                zIndex: 0,
                            }}
                        >
                            <DeepChat
                                ref={chatElementRef}
                                style={{ borderRadius: '10px', height: '400px', width: '300px' }} // Example size, adjust as needed
                                introMessage={{text: 'Hi! This is Pseudobank support assistant. How can we help?'}}
                                request={{url: `/openai-chat-stream-`+process.env.REACT_APP_OPENAI_ENDPOINT_SUFFIX, 
                                    additionalBodyProps: {model: 'gpt-3.5-turbo'}}}
                                requestBodyLimits={{maxMessages: -1}}
                                stream={true}
                            />

                            <button 
                                onClick={() => setIsChatVisible(false)} 
                                className="text-gray-400 hover:text-gray-600 transition ease-in-out duration-150"
                                style={{
                                    position: 'fixed',
                                    right: '30px',
                                    bottom: '425px',
                                    zIndex: 0
                                    }}
                                    >
                                <span className="text-3xl">&times;</span>
                            </button>
                        </div>
                    )}

                    {!isChatVisible && (
                        <button
                            style={{
                            position: 'fixed',
                            right: '20px',
                            bottom: isChatVisible ? '420px' : '20px', // Adjust based on your chat component's height
                            zIndex: 1000,
                            }}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
                            onClick={() => setIsChatVisible(true)}>
                            Chat
                        </button>
                    )}
            </>


    );
}

const PseudobankDeepChat = React.memo(PseudobankDeepChatComponent);

export default PseudobankDeepChat;