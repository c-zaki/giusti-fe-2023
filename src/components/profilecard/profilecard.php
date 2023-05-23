<?php

    $componentClassName = "c-profilecard";
    $configDefault = array(
        "className" => [],
        "variations" => [],
        "innerClasses" => "d-flex flex-column justify-space-between",
        "metaTitleTag" => "h6",
        "metaSubTitleTag" => "p",
        "alternative" => false,
        "eyeletTag" => "h3",
        "title" => "Sample title",
        "subTitle" => "Subtitle • Qualification",
        "img" => [],
        "layout" => "layout1",
        "flipped" => false,
        "hideMetaMobile" => false
    );

    //Array merge between supplied params and default configuration
    $config = array_replace_recursive($configDefault, $view_args);
    $_className = [$componentClassName];
    $_className = array_merge($_className, array_merge($configDefault['className'], $config['className']));
    if (isset($config['variations'])) {
        foreach ($config['variations'] as $key => $variation) {
            $config['variations'][$key] = $componentClassName . "--" . $variation;
        }
        $_className = array_merge($_className, $config['variations']);
    }

    if ($config['alternative']) {
        $config['innerClasses'] = "d-flex flex-row-reverse flex-nowrap";
    }

    if( $config['flipped'] == true ){
        $config['innerClasses'] = "d-flex flex-row align-items-top gap-5";
    }

?>

<div class="<?php echo join(" ", $_className); ?>">
    <?php if ($config['layout'] == "layout1"): ?>
        <div class="<?php echo $componentClassName ?>__inner <?php echo $config['innerClasses']; ?>">
            <div class="<?php echo $componentClassName ?>__media">
                <?php 
                    $imgParams = $config['img'];
                    $imgParams['variations'] = ["ratio-3","hauto"];
                ?>
                <?php echo ZakiUIHelper::renderComponent("img",$imgParams); ?>
            </div>
            <div class="<?php echo $componentClassName ?>__meta <?php if ($config['alternative']): ?>pt-0 pe-5<?php elseif (!$config['flipped']): ?>pt-4<?php endif; ?>">
                <?php if ( !empty( $config['eyelet'] ) ): ?>
                    <<?php echo $config['eyeletTag'] ?> class="<?php echo $componentClassName ?>__meta-eyelet c-typo-style1-size-text-xs"><?php echo $config['eyelet'] ?></<?php echo $config['eyeletTag'] ?>>
                <?php endif; ?>
                <<?php echo $config['metaTitleTag'] ?> class="<?php echo $componentClassName ?>__meta-title c-typo-style1-size-text-s fw-bold"><?php echo $config['title'] ?></<?php echo $config['metaTitleTag'] ?>>
                <<?php echo $config['metaSubTitleTag'] ?> class="<?php echo $componentClassName ?>__meta-subtitle c-typo-style1-size-text-xs"><?php echo $config['subTitle'] ?></<?php echo $config['metaSubTitleTag'] ?>>
            </div>
        </div>
    <?php elseif ($config['layout'] == "layout2"): ?>
        <div class="<?php echo $componentClassName ?>__inner d-flex flex-column text-center">
            <div class="<?php echo $componentClassName ?>__media mx-auto">
                <?php 
                    $imgParams = $config['img'];
                    $imgParams['variations'] = ["ratio-3", "hauto"];
                ?>
                <?php echo ZakiUIHelper::renderComponent("img",$imgParams); ?>
            </div>
            <div class="<?php echo $componentClassName ?>__meta pt-4 <?php if ($config['hideMetaMobile']): ?>d-none d-sm-block<?php endif; ?>">
                <<?php echo $config['metaTitleTag'] ?> class="<?php echo $componentClassName ?>__meta-title c-typo-style1-size-text-m fw-bold"><?php echo $config['title'] ?></<?php echo $config['metaTitleTag'] ?>>
                <<?php echo $config['metaSubTitleTag'] ?> class="<?php echo $componentClassName ?>__meta-subtitle c-typo-style1-size-text-s"><?php echo $config['subTitle'] ?></<?php echo $config['metaSubTitleTag'] ?>>
            </div>
        </div>
    <?php endif; ?>
</div>