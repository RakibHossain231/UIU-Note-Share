export interface CoCreator {
  role: string;
  name: string;
  department: string;
  batch: string;
  avatarUrl: string;
  bio: string;
  githubUrl: string;
  facebookUrl: string;
  linkedinUrl: string;
  email: string;
  mailLabel: string;
}

// Each entry is shown with exactly the same card as the main creator on the About page.
export const CO_CREATORS: CoCreator[] = [
  {
    role: 'Co-Creator',
    name: 'Md. Rakibul Islam Sabid',
    department: 'Department of Computer Science & Engineering (CSE)',
    batch: 'Batch 231',
    avatarUrl: 'https://github.com/sabid179.png',
    bio: 'Hello fellow UIUans! I am an undergraduate student from the Department of CSE at United International University (UIU), Batch 231. As a co-creator of UIU Note Share, I help make sure no student has to struggle or beg in Messenger groups the night before an exam for class notes or question solutions.',
    githubUrl: 'https://github.com/sabid179',
    facebookUrl: 'https://www.facebook.com/sparsebrainer/',
    linkedinUrl: 'https://www.linkedin.com/in/md-rakibul-islam-sabid/',
    email: 'md.rakibulislamsabid179@gmail.com',
    mailLabel: 'Gmail'
  }
];
