--SELECT JSON_AGG(product_data) AS products, COUNT(product_data) AS total_products FROM
-- SELECT product.*,
-- SELECT JSON_AGG(media_data) FROM
--  (SELECT pm.filename,
--	 CASE WHEN pdi.filename IS NOT NULL 
--	  THEN TRUE ELSE FALSE END AS is_display_image,
--	   filepath, description FROM
--		  product_media pm
--			 LEFT JOIN product_display_image pdi
--		   USING (filename)
--		  WHERE
--		 pm.product_id=products.product_id)
--		AS media_data)
--	 AS media)
--	 AS product_data
--	FROM products;

-- SELECT JSON_AGG(product_data) AS products,
--  COUNT(product_data) AS total_products FROM
-- 	(SELECT p.*, 
-- 		(SELECT JSON_AGG(media_data) FROM
-- 			(SELECT pm.filename,
-- 				 CASE WHEN pdi.filename IS NOT NULL
-- 					THEN TRUE ELSE FALSE END AS is_display_image,
-- 					 filepath, description FROM
-- 						product_media pm
-- 						LEFT JOIN product_display_image pdi
-- 						USING (filename)
-- 						WHERE pm.product_id=p.product_id)
-- 					AS media_data) 
-- 				AS media FROM products p
-- 			WHERE p.product_id=173)
-- 		AS product_data;

			SELECT p.*, 
				(SELECT JSON_AGG(media) FROM 
					(SELECT pm.filename, 
					 CASE WHEN pdi.filename IS NOT NULL 
					  THEN true ELSE false END
					   AS is_display_image,
							filepath, description FROM 
							 product_media pm
							  LEFT JOIN product_display_image pdi
							 USING (filename)
							WHERE pm.product_id=p.product_id)
						AS media) 
					AS media 
				FROM products p
			WHERE p.product_id=173;
