function getNode(node) {
	if (document.querySelectorAll(node).length <= 1) {
		return document.querySelector(node);
	} else {
		return document.querySelectorAll(node);
	}
}