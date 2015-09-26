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
     * @param filter {number} 0 = Nearest, 1 = Linear, 2 = Mipmap
     */
    loadTexture: function (texture, filter) {
        var minFilter = (filter == 0) ? GL.NEAREST : GL.LINEAR;
        var maxFilter = (filter == 0) ? GL.NEAREST : (filter == 1) ? GL.LINEAR : GL.LINEAR_MIPMAP_LINEAR;
        GL.bindTexture(GL.TEXTURE_2D, texture);
        GL.pixelStorei(GL.UNPACK_FLIP_Y_WEBGL, 1);
        GL.texImage2D(GL.TEXTURE_2D, 0, GL.RGBA, GL.RGBA, GL.UNSIGNED_BYTE, texture.image);
        GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MAG_FILTER, minFilter);
        GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, maxFilter);
        if(filter == 2) GL.generateMipmap(GL.TEXTURE_2D);
        GL.bindTexture(GL.TEXTURE_2D, null);
    },

    /**
     * Défini la texture diffuse
     * @param diffuseSrc {String} chemin de l'image de la texture
     * @param filter {number} 0 = Nearest, 1 = Linear, 2 = Mipmap
     * @returns {ENGINE.Material}
     */
    bindDiffuse: function (diffuseSrc, filter) {
        this.diffuse = GL.createTexture();
        this.diffuse.image = new Image();
        var instance = this;
        this.diffuse.image.onload = function() {
            instance.loadTexture(instance.diffuse, filter);
        };
        this.diffuse.image.src = diffuseSrc;
        return this;
    },

    /**
     * Défini la texture normal
     * @param normalSrc {String} chemin de l'image de la texture
     * @param filter {number} 0 = Nearest, 1 = Linear, 2 = Mipmap
     * @returns {ENGINE.Material}
     */
    bindNormal: function (normalSrc, filter) {
        this.normal = GL.createTexture();
        this.normal.image = new Image();
        var instance = this;
        this.normal.image.onload = function() {
            instance.loadTexture(instance.normal, filter);
        };
        this.normal.image.src = normalSrc;
        return this;
    }
};