import { RouterProvider } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './base.scss'
import './i18n'
import { plausible } from './plausible'
import { router } from './router'

//document.setupLoaded = false;

//(global as any).foo = bar;
const container = document.getElementById('app')!

const root = createRoot(container)
root.render(<RouterProvider router={router} />)

plausible.enableAutoPageviews()

/*const event = new Event('submit', { bubbles: true })
  const form = document.querySelector('form')
  console.log (form)
  if (form) {
    console.log("on dispatche !")
    form.dispatchEvent(event)
  }*/

/*document.addEventListener('readystatechange', e => {
    if(document.readyState === "complete"){
        const input = document.getElementsByName("input")[0] as HTMLInputElement
        input.value = "Les poulets de lait";
        /*ChatMessageInput(props =>
            {

            }

       // document.getElementsByName("input")[0].value = "Les poulets de lait";
//       const textarea = document.querySelector('textarea[name="input"]');
  //      textarea.value = "meuh";
        if (document.getElementsByTagName("form")) {
            document.getElementsByTagName("form")[0].submit()
        }
        
      console.log("let's go !")
    }
  });
*/