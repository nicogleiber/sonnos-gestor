const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    gym: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Gym',
      required: [true, 'El gimnasio es obligatorio'],
      index: true,
    },
    codigo: {
      type: String,
      trim: true,
      uppercase: true,
    },
    nombre: {
      type: String,
      required: [true, 'El nombre del producto es obligatorio'],
      trim: true,
      maxlength: 100,
    },
    categoria: {
      type: String,
      trim: true,
      default: 'General',
    },
    costo: {
      type: Number,
      required: [true, 'El costo del producto es obligatorio'],
      min: [0, 'El costo no puede ser negativo'],
      default: 0,
    },
    margen: {
      type: Number,
      min: [0, 'El margen no puede ser negativo'],
      default: 30,
    },
    precioVenta: {
      type: Number,
      required: [true, 'El precio de venta es obligatorio'],
      min: [0, 'El precio de venta no puede ser negativo'],
    },
    stock: {
      type: Number,
      default: 0,
      min: [0, 'El stock no puede ser negativo'],
    },
    stockMinimo: {
      type: Number,
      default: 5,
      min: [0, 'El stock mínimo no puede ser negativo'],
    },
    descripcion: {
      type: String,
      trim: true,
    },
    activo: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id;
        ret.bajoStock = ret.stock <= ret.stockMinimo;
        delete ret.__v;
        return ret;
      },
    },
  }
);

productSchema.virtual('bajoStock').get(function () {
  return this.stock <= this.stockMinimo;
});

// Índices compuestos multi-tenant
productSchema.index({ gym: 1, activo: 1 });
productSchema.index({ gym: 1, codigo: 1 });
productSchema.index({ gym: 1, nombre: 1 });
productSchema.index({ gym: 1, categoria: 1 });
productSchema.index({ gym: 1, stock: 1 });

module.exports = mongoose.model('Product', productSchema);
