/**
 * Créée une texture vide
 * @constructor
 */
ENGINE.Material = function() {

};

ENGINE.Material.prototype = {
    constructor: ENGINE.Material,

    /**
     * Charge une texture
     * @param texture
     */
    loadTexture: function (texture) {
        GL.bindTexture(GL.TEXTURE_2D, texture);
        GL.pixelStorei(GL.UNPACK_FLIP_Y_WEBGL, true);
        GL.texImage2D(GL.TEXTURE_2D, 0, GL.RGBA, GL.RGBA, GL.UNSIGNED_BYTE, texture.image);
        GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MAG_FILTER, GL.NEAREST);
        GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, GL.NEAREST);
        GL.bindTexture(GL.TEXTURE_2D, null);
    },

    /**
     * Défini la texture diffuse
     * @param diffuseSrc {String} chemin de l'image de la texture
     * @returns {ENGINE.Material}
     */
    bindDiffuse: function (diffuseSrc) {
        this.diffuse = GL.createTexture();
        this.diffuse.image = new Image();
        var instance = this;
        this.diffuse.image.onload = function() {
            instance.loadTexture(instance.diffuse);
        };
        this.diffuse.image.src = diffuseSrc;
        return this;
    },

    /**
     * Défini la texture normal
     * @param normalSrc {String} chemin de l'image de la texture
     * @returns {ENGINE.Material}
     */
    bindNormal: function (normalSrc) {
        this.normal = GL.createTexture();
        this.normal.image = new Image();
        var instance = this;
        this.normal.image.onload = function() {
            instance.loadTexture(instance.normal);
        };
        this.normal.image.src = normalSrc;
        return this;
    }
};