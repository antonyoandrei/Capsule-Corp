const paths = {
  bag: ["M5 7h14l1 14H4L5 7Z", "M8 9V6a4 4 0 0 1 8 0v3"],
  search: ["M10.5 17a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13Z", "m15.5 15.5 5 5"],
  logout: ["M9 4H4v16h5M9 12h12m-4-4 4 4-4 4"],
  arrow: ["M5 12h14m-5-5 5 5-5 5"],
  star: ["m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9L12 3Z"],
  shirt: ["m8 3-5 3 2 5 3-1v11h8V10l3 1 2-5-5-3a4 4 0 0 1-8 0Z"],
  box: ["m12 3 9 5-9 5-9-5 9-5Zm-9 5v10l9 4 9-4V8M12 13v9M7.5 5.5l9 5"],
}

const StoreIcon = ({ name, filled = false }: { name: keyof typeof paths | "dragonball"; filled?: boolean }) => name === "dragonball" ? (
  <span className={"store-icon store-icon-dragonball" + (filled ? " is-filled" : "")} aria-hidden="true" />
) : (
  <svg className={"store-icon store-icon-" + name} width="20" height="20" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {paths[name].map(path => <path key={path} d={path} />)}
  </svg>
)

export default StoreIcon
