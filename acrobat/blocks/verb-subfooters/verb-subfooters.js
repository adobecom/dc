export default function init(el) {
  const mobileVerbFooter = document.querySelectorAll('.tablet');
  const desktopVerbFooter = document.querySelectorAll('.verb-subfooter');
  if (mobileVerbFooter) {
    mobileVerbFooter[0].parentElement.classList.add('mobile-verb-footer');
  }

  // const rows = el.querySelectorAll(':scope > div');
  // rows.forEach((row, rdx) => {
  //   row.className = `row row-${rdx + 1}`;
  //   const cols = row.querySelectorAll(':scope > div');
  //   cols.forEach((col, cdx) => {
  //     col.className = `col col-${cdx + 1}`;
  //   });
  // });

  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
  // true for mobile device
    mobileVerbFooter[0].parentElement.classList.add('mobile-verb-footer-show');
    desktopVerbFooter[0].parentElement.classList.add('hide');
    console.log('mobil');
  } else {
    console.log('not mobile');
    // false for not mobile device

  }
}
