import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { productosApi } from '../api/productosApi'
import { cajaApi } from '../api/cajaApi'

const CajaContext = createContext()

export function CajaProvider({ children }) {
  const [productos, setProductos] = useState([])
  const [carrito, setCarrito] = useState([])
  const [movimientos, setMovimientos] = useState([])
  const [cierreReporte, setCierreReporte] = useState(null)
  const [loading, setLoading] = useState(false)

  // Cargar productos
  const fetchProductos = useCallback(async (params = {}) => {
    setLoading(true)
    try {
      const data = await productosApi.getAll(params)
      setProductos(data)
    } catch (err) {
      console.warn('Error al cargar productos:', err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  // Cargar movimientos del día
  const fetchMovimientos = useCallback(async (fecha) => {
    try {
      const data = await cajaApi.getMovimientos({ fecha })
      setMovimientos(data)
    } catch (err) {
      console.warn('Error al cargar movimientos de caja:', err.message)
    }
  }, [])

  // Cargar reporte de cierre
  const fetchCierreDia = async (fecha) => {
    try {
      const data = await cajaApi.getCierreDia(fecha)
      setCierreReporte(data)
      return data
    } catch (err) {
      console.warn('Error al cargar reporte de cierre:', err.message)
      return null
    }
  }

  useEffect(() => {
    fetchProductos()
    fetchMovimientos()
  }, [fetchProductos, fetchMovimientos])

  // Operaciones de Carrito (Punto de Venta)
  const addToCarrito = (producto) => {
    setCarrito(prev => {
      const exists = prev.find(item => item.productoId === (producto._id || producto.id))
      if (exists) {
        if (exists.cantidad >= producto.stock) return prev // No exceder stock
        return prev.map(item =>
          item.productoId === (producto._id || producto.id)
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        )
      }
      return [
        ...prev,
        {
          productoId: producto._id || producto.id,
          codigo: producto.codigo,
          nombre: producto.nombre,
          precioUnitario: producto.precioVenta,
          cantidad: 1,
          stockMaximo: producto.stock
        }
      ]
    })
  }

  const removeFromCarrito = (productoId) => {
    setCarrito(prev => prev.filter(item => item.productoId !== productoId))
  }

  const updateCantidadCarrito = (productoId, cantidad) => {
    if (cantidad <= 0) {
      removeFromCarrito(productoId)
      return
    }
    setCarrito(prev =>
      prev.map(item =>
        item.productoId === productoId
          ? { ...item, cantidad: Math.min(cantidad, item.stockMaximo) }
          : item
      )
    )
  }

  const clearCarrito = () => setCarrito([])

  const totalCarrito = carrito.reduce(
    (acc, item) => acc + item.precioUnitario * item.cantidad,
    0
  )

  // Registrar Venta Tienda
  const registrarVentaTienda = async ({ metodoPago, socioNombre, descuento }) => {
    try {
      const res = await cajaApi.registrarVentaTienda({
        items: carrito,
        metodoPago,
        socioNombre,
        descuento
      })
      clearCarrito()
      await fetchProductos()
      await fetchMovimientos()
      return res
    } catch (err) {
      throw err
    }
  }

  // CRUD Productos
  const addProducto = async (data) => {
    const nuevo = await productosApi.create(data)
    await fetchProductos()
    return nuevo
  }

  const updateProducto = async (id, data) => {
    const actualizado = await productosApi.update(id, data)
    await fetchProductos()
    return actualizado
  }

  const deleteProducto = async (id) => {
    await productosApi.delete(id)
    await fetchProductos()
  }

  return (
    <CajaContext.Provider
      value={{
        productos,
        fetchProductos,
        addProducto,
        updateProducto,
        deleteProducto,
        carrito,
        addToCarrito,
        removeFromCarrito,
        updateCantidadCarrito,
        clearCarrito,
        totalCarrito,
        registrarVentaTienda,
        movimientos,
        fetchMovimientos,
        cierreReporte,
        fetchCierreDia,
        loading
      }}
    >
      {children}
    </CajaContext.Provider>
  )
}

export function useCaja() {
  const context = useContext(CajaContext)
  if (!context) {
    throw new Error('useCaja debe usarse dentro de un CajaProvider')
  }
  return context
}
