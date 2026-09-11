const mongoose = require('mongoose');

const inventoryMovementSchema = new mongoose.Schema(
  {
    gym: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Gym',
      required: [true, 'El gimnasio es obligatorio'],
      index: true,
    },
    producto: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'El producto es obligatorio'],
      index: true,
    },
    productoNombre: {
      type: String,
      trim: true,
    },
    tipo: {
      type: String,
      enum: {
        values: ['ingreso', 'egreso', 'venta', 'ajuste', 'devolucion'],
        message: '{VALUE} no es un tipo de movimiento de inventario válido',
      },
      required: [true, 'El tipo de movimiento es obligatorio'],
    },
    cantidad: {
      type: Number,
      required: [true, 'La cantidad es obligatoria'],
    },
    stockAnterior: {
      type: Number,
      required: true,
    },
    stockNuevo: {
      type: Number,
      required: true,
    },
    motivo: {
      type: String,
      trim: true,
    },
    usuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'El usuario que registra el movimiento es obligatorio'],
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        delete ret.__v;
        return ret;
      },
    },
  }
);

inventoryMovementSchema.index({ gym: 1, producto: 1 });
inventoryMovementSchema.index({ gym: 1, tipo: 1 });
inventoryMovementSchema.index({ gym: 1, createdAt: -1 });

module.exports = mongoose.model('InventoryMovement', inventoryMovementSchema);
