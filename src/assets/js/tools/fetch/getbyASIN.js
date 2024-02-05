export default async function getbyASIN(arr) {
  const combinedArr = [...arr];
  console.log('getbyASIN sendMessage');
  chrome.runtime.sendMessage({ action: 'fetchData', arr: combinedArr });
}
