import React from 'react';

export default function(){
  console.log('not found');
  return <div className="shadow-box"
              style = {{width: '400px',
                        margin: '70px auto',
                        height: '300px'}}>
            <h1>{'404 Not Found'}</h1>
            <p>{'The page you are looking for does not exist.'}</p>
         </div>
}
