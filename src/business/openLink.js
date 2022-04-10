export default function openLink(url) {
	if(window.nw) {
		window.nw.Shell.openExternal(url);
	} else {
		window.open(url, '_blank').focus();
	}
};