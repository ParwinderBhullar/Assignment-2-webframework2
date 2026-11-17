import {studentConfig} from '@/student-config';
export default function About(){return <section className="panel"><h1>About this collection</h1><p>{studentConfig.aboutLine}</p><p className="muted">Artwork metadata is provided by The Metropolitan Museum of Art Collection API.</p></section>}
