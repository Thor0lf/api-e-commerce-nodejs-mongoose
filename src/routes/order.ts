import { Router, Request, Response } from 'express';
import passport from 'passport';
import Order from '../models/order';
import Product from '../models/product';
import { Types } from 'mongoose';

const order = Router();

order.get('/', passport.authenticate('jwt', { session: false }), async (req: Request, res: Response) => {
    try {
      const orders = await Order.find({});
      if (orders.length === 0) {
        return res.status(200).json({ message: 'Le panier est vide.' });
      }
      return res.status(200).json(orders);
    } catch (error) {
      return res.status(500).json({ message: 'Erreur lors de la récupération des paniers.' });
    }
  });

order.get('/:orderId', passport.authenticate('jwt', { session: false }), async (req: Request, res: Response) => {
  const orderId = req.params.orderId;
  try {
    const order = await Order.findOne({ _id: orderId });
    if (order === null ) {
        return res.status(200).json({ message: 'Le panier est vide.' });
      }
    return res.status(200).json(order);
  } catch (error) {
    return res.status(500).json({ message: 'Erreur lors de la récupération du produit.' });
  }
});

order.post('/', passport.authenticate('jwt', { session: false }), async (req: Request, res: Response) => {
    try {
      const userId = req.user;
        const existingOrder = await Order.findOne({ user: userId });
  
      if (existingOrder) {
        return updateOrder(req, res);
      } else {
        return createOrder(req, res);
      }
    } catch (error) {
      return res.status(500).json({ message: 'Erreur lors de la création ou de la modification du panier.' });
    }
  });
  
  async function createOrder(req: Request, res: Response) {
    try {
      const userId = req.user;
      const { productId } = req.body;
  
      const newOrder = new Order({
        user: userId,
      });

      newOrder.products.push(productId);
  
      await newOrder.save();

      const product = await Product.findById(productId);
  
      return res.status(201).json({ message: `Le produit ${product?.name} a été ajouté à votre panier.` });
    } catch (error) {
      return res.status(500).json({ message: 'Erreur lors de la création du panier.' });
    }
  }
  
  async function updateOrder(req: Request, res: Response) {
    try {
      return order.patch('/:orderId/add-product', passport.authenticate('jwt', { session: false }), async (req: Request, res: Response) => {
        try {
            const { orderId } = req.params;
            const { productId } = req.body;
        
            const existingOrder = await Order.findById(orderId);
            if (!existingOrder) {
              return res.status(404).json({ message: 'Panier non trouvé.' });
            }
        
            existingOrder.products.push(...productId);
            await existingOrder.save();

            const product = await Product.findById(productId);
        
            return res.status(200).json({ message: `Le produit ${product?.name} a été ajouté au panier.` });
        } catch (error) {
        return res.status(500).json({ message: 'Erreur lors de l\'ajout de produit au panier.' });
        }
      });
    } catch (error) {
      return res.status(500).json({ message: 'Erreur lors de la modification du panier.' });
    }
  }

  order.patch('/:orderId/add-product', passport.authenticate('jwt', { session: false }), async (req: Request, res: Response) => {
    try {
        const { orderId } = req.params;
        const { productId } = req.body;
    
        const existingOrder = await Order.findById(orderId);
        if (!existingOrder) {
          return res.status(404).json({ message: 'Panier non trouvé.' });
        }

        const validProductId = new Types.ObjectId(productId);

        const productExists = await Product.exists({ _id: validProductId });
        if (!productExists) {
          return res.status(404).json({ message: 'Produit non trouvé.' });
        }

        existingOrder.products.push(validProductId);
        await existingOrder.save();

        const product = await Product.findById(validProductId);
    
        return res.status(200).json({ message: `Le produit ${product?.name} a été ajouté au panier.` });
    } catch (error) {
        console.log(error);
        
        return res.status(500).json({ message: 'Erreur lors de l\'ajout de produit au panier.' });
    }
});

  order.patch('/:orderId/remove-product', passport.authenticate('jwt', { session: false }), async (req: Request, res: Response) => {
    try {
      const { orderId } = req.params;
      const { productId } = req.body;
  
      const existingOrder = await Order.findById(orderId);
      if (!existingOrder) {
        return res.status(404).json({ message: 'Panier non trouvé.' });
      }

      const product = await Product.findById(productId);
  
      const indexToRemove = existingOrder.products.findIndex(product => product.toString() === productId);
      if (indexToRemove === -1) {
        return res.status(404).json({ message: 'Produit non trouvé dans le panier.' });
      }      
      existingOrder.products.splice(indexToRemove, 1);

      await existingOrder.save();
  
      return res.status(200).json({ message: `Le produit ${product?.name} a été enlevé du panier.` });
    } catch (error) {
      return res.status(500).json({ message: 'Erreur lors du retrait du produit du panier.' });
    }
  });

  order.patch('/:orderId/remove-products-with-same-id', passport.authenticate('jwt', { session: false }), async (req: Request, res: Response) => {
    try {
      const { orderId } = req.params;
      const { productId } = req.body;
  
      const existingOrder = await Order.findById(orderId);
      if (!existingOrder) {
        return res.status(404).json({ message: 'Panier non trouvé.' });
      }

      const product = await Product.findById(productId);
  
      existingOrder.products = existingOrder.products.filter((product) => product.toString() !== productId);
      await existingOrder.save();
  
      return res.status(200).json({ message: `Tous les produits ${product?.name} ont été enlevés du panier.` });
    } catch (error) {
      return res.status(500).json({ message: 'Erreur lors de la suppression des produits du panier.' });
    }
  });

  order.delete('/:orderId', passport.authenticate('jwt', { session: false }), async (req: Request, res: Response) => {
    try {
        const { orderId } = req.params;

        const existingOrder = await Order.findById(orderId);
        if (!existingOrder) {
            return res.status(404).json({ message: 'Panier non trouvé.' });
        }
        
        await existingOrder.deleteOne();
        return res.status(200).json({ message: 'Le panier a été vidé.' });
    } catch (error) {
      return res.status(500).json({ message: 'Erreur lors de la suppression du panier.' });
    }
  });

export default order;