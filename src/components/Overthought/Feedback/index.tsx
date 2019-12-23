import * as React from 'react'
import { BlogPost } from '~/types';
import { PrimaryButton } from '~/components/Button'
import { H5, P, A } from '~/components/Typography'
import { InputGrid, Container, Form, Textarea, Input, Success, Error } from './style'

interface Props {
  post: BlogPost;
};

export default function Feedback({ post }: Props) {
  const [data, setData] = React.useState({
    message: "",
    email: "",
    _optin: false
  })

  const [serverState, setServerState] = React.useState({
    submitting: false,
    submitted: false,
    error: false
  });

  function onChange(e) {
    setData({
      ...data, 
      [e.target.name]: e.target.type == "checkbox" 
        ? e.target.checked 
        : e.target.value
      })
  }

  function handleSubmit(e) {
    e.preventDefault();
    const form = e.target;
    setServerState({ submitting: true, submitted: false, error: false });

    // TODO: Replace the endpoint below with one created at
    // https://formspree.io/create

    fetch("https://formspree.io/xjvgkrar", {
      method: "POST",
      body: new FormData(form),
      headers: {
        Accept: "application/json"
      }
    }).then(response => {
      if (response.ok) {
        setServerState({ submitting: false, submitted: true, error: false });
        form.reset();
        setData({...data, message: ''})
      } else {
        response.json().then(data => {
          setServerState({
            submitting: false,
            submitted: true,
            error: data.error
          });
        });
      }
    });
  }

  return (
    <Container>
      <H5 style={{ marginTop: 0, display: 'flex', alignItems: 'center' }}>
        <span style={{ display: 'flex', alignItems: 'center', paddingRight: '16px' }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
        </span>
        A small favor
      </H5>
      <P style={{ marginTop: 0 }}>Was anything I wrote confusing, outdated, or incorrect? Please let me know! Just write a few words below and I'll be sure to amend this post with your suggestions.</P>

      <Form onSubmit={handleSubmit}>
        <input type="hidden" value={`New comment on ${post.title}`} id={post.title} name="_subject" readOnly/>
        <Textarea onChange={onChange} value={data.message} id="message" name="message" placeholder="What should I know?"></Textarea>
        <InputGrid>
          <Input onChange={onChange} id="email" name="email" value={data.email} placeholder={`Email ${!data._optin ? '(Optional)' : '(Required)'}`} />
          <Input id="twitter" name="twitter" placeholder="Twitter handle (Optional)" />
        </InputGrid>
        <label>
          <input id="optin" type="checkbox" name="_optin" onChange={onChange} checked={data._optin} style={{
            WebkitAppearance: "checkbox", MozAppearance: "checkbox", marginRight: "0.5rem"
          }} /> 
          <strong> Follow Along </strong> 
          If you want to know about new posts, check here to subscribe. Alternatively, you can <A href="https://overthought.ghost.io/rss/" target="_blank" rel="noopener noreferrer">subscribe with RSS</A>.
        </label>
        <PrimaryButton disabled={serverState.submitting || !data.message || (data._optin && !data.email)} type="submit">Send</PrimaryButton>
        {serverState.submitted &&
          (serverState.error ? (
            <Error>{serverState.error}</Error>
          ) : (
            <Success>Thanks for taking the time to leave a note!</Success>
          ))
        }
      </Form>
    </Container>
  )
}