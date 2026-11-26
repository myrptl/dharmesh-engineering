import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ACCEPTED_DRAWING_MIME_TYPES,
  FORM_MIN_REVIEW_TIME_MS,
  MAX_DRAWING_FILE_SIZE_BYTES,
  SCRIPT_URL,
} from '../constants.js';
import { SectionHead, Reveal, Magnetic } from './Primitives.js';

const readB64 = file =>
  new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(String(r.result).split(',')[1]);
    r.onerror = () => rej(new Error('Could not read the drawing file.'));
    r.readAsDataURL(file);
  });

export default function Contact() {
  const loadedAt = useRef(Date.now());
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState(null); // {ok, msg}
  const [fileName, setFileName] = useState('');

  const submit = async e => {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.elements['website_address'].value) return; // honeypot
    if (Date.now() - loadedAt.current < FORM_MIN_REVIEW_TIME_MS) {
      setStatus({
        ok: false,
        msg: 'Please take a moment to review the form before submitting.',
      });
      return;
    }
    setBusy(true);
    setStatus(null);
    try {
      const file = form.elements['drawing'].files[0];
      if (file) {
        if (!ACCEPTED_DRAWING_MIME_TYPES.includes(file.type))
          throw new Error('Please attach a PDF or JPG/JPEG file.');
        if (file.size > MAX_DRAWING_FILE_SIZE_BYTES)
          throw new Error('The drawing must be 5 MB or smaller.');
      }
      const payload = {
        company_name: form.elements['company_name'].value.trim(),
        your_name: form.elements['your_name'].value.trim(),
        email: form.elements['email'].value.trim(),
        description: form.elements['description'].value.trim(),
        drawing:
          file ?
            {
              fileName: file.name,
              mimeType: file.type,
              base64: await readB64(file),
            }
          : null,
      };
      const resp = await fetch(SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload),
      });
      const result = await resp.json();
      if (!result.success)
        throw new Error(result.message || 'Submission failed.');
      setStatus({
        ok: true,
        msg: result.message || 'Thank you. We have received your enquiry.',
      });
      form.reset();
      setFileName('');
    } catch (err) {
      setStatus({
        ok: false,
        msg:
          err.message === 'Failed to fetch' ?
            "We couldn't confirm submission. Please try again or email dharmeshenggg@gmail.com."
          : err.message,
      });
    } finally {
      setBusy(false);
    }
  };

  return (
    <section id='contact' className='section contact'>
      <div className='container'>
        <SectionHead
          eyebrow='Contact'
          title="Have a drawing? Let's talk."
          accent={[2, 3]}>
          Share your drawing, material and order quantity. We will review the
          information and assess manufacturing feasibility.
        </SectionHead>

        <div className='contact-grid'>
          <Reveal className='contact-left'>
            <div className='info-card'>
              <h3>Workshop</h3>
              <p>
                Dharmesh Engineering
                <br />
                Antaliya GIDC, Bilimora
                <br />
                Gujarat, India
              </p>
            </div>
            <div className='info-card'>
              <h3>Email</h3>
              <p>
                <a href='mailto:myrptl65@gmail.com'>dharmeshenggg@gmail.com</a>
              </p>
            </div>
            <div className='info-card'>
              <h3>Phone</h3>
              <p>
                <a className='phone-link' href='tel:+917359443766'>
                  <svg
                    className='phone-icon'
                    viewBox='0 0 24 24'
                    aria-hidden='true'>
                    <path
                      d='M5 4h3l2 5-2 1.5a15 15 0 005.5 5.5L15 14l5 2v3a1 1 0 01-1 1A16 16 0 014 5a1 1 0 011-1z'
                      fill='none'
                      stroke='currentColor'
                      strokeWidth='1.7'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                  </svg>
                  +91 7359443766
                </a>
              </p>
            </div>
            <div className='map'>
              <iframe
                title='Dharmesh Engineering location on Google Maps'
                src='https://maps.google.com/maps?q=20.7708222,73.0018479&z=16&output=embed'
                loading='lazy'
                referrerPolicy='no-referrer-when-downgrade'
                allowFullScreen
              />
              <a
                href='https://www.google.com/maps/place/Dharmesh+Engineering/@20.7705848,73.0013568,19.29z/data=!4m6!3m5!1s0x3be0f3a3802088c1:0x1a26988118502114!8m2!3d20.7708222!4d73.0018479!16s%2Fg%2F11sv_h08dp'
                target='_blank'
                rel='noopener noreferrer'>
                Open in Google Maps ↗
              </a>
            </div>
          </Reveal>

          <Reveal className='form-wrap' delay={0.15}>
            <form onSubmit={submit} className='form'>
              <h3>Request a quotation</h3>
              <div className='hp' aria-hidden='true'>
                <label htmlFor='website-address'>Leave this field empty</label>
                <input
                  type='text'
                  id='website-address'
                  name='website_address'
                  tabIndex={-1}
                  autoComplete='off'
                />
              </div>
              <div className='row'>
                <div className='field'>
                  <input
                    id='company'
                    name='company_name'
                    required
                    placeholder=' '
                  />
                  <label htmlFor='company'>Company name *</label>
                </div>
                <div className='field'>
                  <input id='name' name='your_name' required placeholder=' ' />
                  <label htmlFor='name'>Your name *</label>
                </div>
              </div>
              <div className='field'>
                <input
                  id='email'
                  type='email'
                  name='email'
                  required
                  placeholder=' '
                />
                <label htmlFor='email'>Business email *</label>
              </div>
              <div className='field'>
                <textarea
                  id='desc'
                  name='description'
                  rows={5}
                  required
                  placeholder=' '
                />
                <label htmlFor='desc'>Description of requirements *</label>
              </div>
              <label className='file' htmlFor='drawing'>
                <svg viewBox='0 0 24 24' aria-hidden='true'>
                  <path
                    d='M12 16V4m0 0L7 9m5-5l5 5M4 16v3a1 1 0 001 1h14a1 1 0 001-1v-3'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='1.8'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                </svg>
                <span>
                  {fileName ||
                    'Attach a drawing (optional) — PDF, JPG or JPEG, up to 5 MB'}
                </span>
                <input
                  id='drawing'
                  name='drawing'
                  type='file'
                  accept='.pdf,.jpg,.jpeg,application/pdf,image/jpeg'
                  onChange={e => setFileName(e.target.files[0]?.name || '')}
                />
              </label>
              <Magnetic
                type='submit'
                className='btn-primary submit'
                disabled={busy}>
                {busy ? 'Submitting…' : 'Submit enquiry →'}
              </Magnetic>
              <AnimatePresence>
                {status && (
                  <motion.p
                    key={status.msg}
                    role='status'
                    aria-live='polite'
                    className={'status ' + (status.ok ? 'ok' : 'err')}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}>
                    {status.msg}
                  </motion.p>
                )}
              </AnimatePresence>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
