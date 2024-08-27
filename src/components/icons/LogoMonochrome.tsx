interface PropsWithClassName {
  className?: string;
}

const LogoMonochrome = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      width='321'
      height='203'
      viewBox='0 0 321 203'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      {...props}
    >
			<title>Alwurts Logo</title>
      <rect
        x='242'
        y='21'
        width='39.2372'
        height='94.4799'
        rx='19.6186'
        transform='rotate(-28 242 21)'
        fill='currentColor'
        className='text-neutral-300 dark:text-neutral-700'
      />
      <rect
        x='153'
        y='20.4207'
        width='41.1057'
        height='205.989'
        rx='20.5528'
        transform='rotate(-28 153 20.4207)'
        fill='currentColor'
        className='text-neutral-400 dark:text-zinc-700'
      />
      <rect
        x='61'
        y='19.2979'
        width='41.1057'
        height='205.989'
        rx='20.5528'
        transform='rotate(-28 61 19.2979)'
        fill='currentColor'
        className='text-neutral-400 dark:text-zinc-700'
      />
      <path
        d='M75 92.5L54 55.5L0 194H34.5L49 159.5H108L93 129H60L75 92.5Z'
        fill='currentColor'
        className='text-neutral-300 dark:text-neutral-700'
      />
    </svg>
  );
};

export default LogoMonochrome;
